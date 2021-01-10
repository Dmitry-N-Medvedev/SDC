ARG DEBIAN_FRONTEND=noninteractive

# ENV NODE_ENV=production

FROM debian:latest AS os-base
SHELL ["/bin/bash", "-c"]
RUN apt-get --assume-yes update && \
    apt-get --assume-yes upgrade
RUN apt-get --assume-yes install ca-certificates

FROM os-base AS sys-utils
RUN apt-get --assume-yes --no-install-recommends install apt-utils curl openssl

FROM sys-utils AS add-pm2-user
RUN adduser --system --shell /bin/bash --disabled-password pm2 && usermod -aG root pm2
USER pm2

FROM add-pm2-user AS volta
RUN curl --anyauth --progress-bar --http2 --retry 10 --tcp-fastopen https://get.volta.sh | bash

FROM volta AS node-pnpm-pm2
ENV PATH=~/.volta/bin:$PATH
RUN volta install node@15.5.1 && \
    volta install pnpm@5.14.3 && \
    volta install pm2@latest && \
    pnpm config set store-dir ~/.pnpm-store

FROM node-pnpm-pm2 AS reduce-pm2-rights
ENV PATH=~/.volta/bin:$PATH
USER root
RUN deluser pm2 root && usermod -aG nogroup pm2 && chown pm2:nogroup /home/pm2

FROM reduce-pm2-rights as sys-cleanup
RUN apt-get autoremove --purge --assume-yes && apt-get clean --assume-yes
USER pm2
