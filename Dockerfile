ARG DEBIAN_FRONTEND=noninteractive

FROM debian:latest AS os-base
SHELL ["/bin/bash", "-c"]
RUN apt-get --assume-yes update && \
    apt-get --assume-yes upgrade
RUN apt-get --assume-yes install ca-certificates

FROM os-base AS sys-utils
RUN apt-get --assume-yes --no-install-recommends install apt-utils curl openssl && \
    apt-get autoremove --purge --assume-yes && apt-get clean --assume-yes

FROM sys-utils AS add-pm2-user
RUN adduser \
    --system \
    --shell /bin/bash \
    --disabled-password \
    --home /home/pm2 \
    pm2
RUN usermod -aG root pm2

FROM add-pm2-user AS install-volta
USER pm2
RUN curl --anyauth --progress-bar --http2 --retry 10 --tcp-fastopen https://get.volta.sh | bash

FROM install-volta AS install-node-pnpm-pm2
ENV PATH=~/.volta/bin:$PATH
RUN volta install node@15.5.1 && \
    volta install pnpm@5.15.0 && \
    volta install pm2@latest && \
    pnpm config set store-dir ~/.pnpm-store

FROM install-node-pnpm-pm2 AS reduce-pm2-rights
USER root
RUN deluser pm2 root && usermod -aG nogroup pm2 && chown pm2:nogroup /home/pm2

# FROM reduce-pm2-rights as sys-cleanup
# RUN apt-get autoremove --purge --assume-yes && apt-get clean --assume-yes

FROM reduce-pm2-rights as copy-project-files
USER pm2
WORKDIR /home/pm2/dsc
ADD --chown=pm2:nogroup ./ .
# COPY --chown=pm2:nogroup ./configs/.bashrc /home/pm2
RUN pnpm --recursive install

FROM copy-project-files as ready-to-rock-and-roll
LABEL maintainer="Dmitry N. Medvedev <dmitry.medvedev@gmail.com>"
LABEL version="0.0.0"
ENV PATH=~/.volta:~/.volta/bin:$PATH
ENV NODE_ENV=production
CMD pm2-runtime start ./ecosystem.config.js
