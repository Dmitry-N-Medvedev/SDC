# How To

## HOW IT IS ORGANIZED

You can see the following directory structure:

```bash
 \-+
   |
   +-docs
   |
   +-scripts
   |
   +-sources
   |
  ...
```

The `docs` directory contains the initial task and images ( which I shamefully torn off the given PDF file. Let me know if it is copyrighted in any way ).

The scripts directory contains two bash files: [build-container.sh](../scripts/build-container.sh) and [run-container.sh](../scripts/run-container.sh). They are useful if you as lazy as I am to type commands myself over and over again. Have a look at them, come back with any feedback you might have.

The `sources` directory contains the sources, yes. There are two important subdirectories: the [libs](../sources/libs) and the [servers](../sources/servers). They host library sources and the [api](../sources/servers/api) server built on these libraries.

### LIBS

#### LIBCOMMON

The [libCommon](../sources/libs/libCommon) which contains the [Degrees.mjs](../sources/libs/libCommon/constants/Degrees.mjs) and the [Directions.mjs](../sources/libs/libCommon/constants/Directions.mjs) files.

These guys contain constants used in other parts of the system.

#### LIBDIRECTIONCALCULATOR

The [libDirectionCalculator](../sources/libs/libDirectionCalculator) with a single [calculateDirection.mjs](../sources/libs/libDirectionCalculator/calculateDirection.mjs) exporting the only `calculateDirection` function.

This function is the main outcome of this project. Please come back to me with *any* suggestions/arguments/general feedback.

#### LIBSERVER

The [libServer](../sources/libs/libServer) hosts implementation of the HTTP server. The server exposes the `/direction` endpoint. Its code resides in the [libServer.mjs](../sources/libs/libServer/libServer.mjs) and the [handleDirection.mjs](../sources/libs/libServer/handlers/handleDirection.mjs) files.

You will not see the notorious (a.k.a. *the bloated*, *the slow*, *the hype*) [Express.js](https://expressjs.com/) here. All the heavy lifting is done by the brilliant [µWebSockets.js](https://github.com/uNetworking/uWebSockets.js). Take your time, go check it out. I urge you to especially see the [Motivation and goals](https://github.com/uNetworking/uWebSockets/blob/master/misc/READMORE.md) of the project. **`It's just awesome`**.

## HOW TO SETUP IT ALL

I'll tell you what I use, but you can use any tools you like of course.

### VOLTA

`Volta` is the installer of the `node`, [pnpm](#pnpm), and [pm2](#pm2). It's simple, it's [rust](https://www.rust-lang.org/), and it's *fast*. [Go check it out](https://volta.sh/) and install, and use it.

To install all of the necessary stuff do the following

```bash
volta install node@15.5.1
```

```bash
volta install pnpm@5.15.0
```

```bash
volta install pm2@4.5.1
```

```bash
pnpm config set store-dir ~/.pnpm-store
```

To check how it all has settled, issue the following command

```bash
volta list all
```

... and be presented with a concise report like this

```bash
dmitrymedvedev@Dmitrys-MacBook-Pro ~ % volta list all
⚡️ User toolchain:

    Node runtimes:
        v15.5.0
        v15.5.1 (current @ /Users/dmitrymedvedev/package.json)

    Package managers:


    Packages:
        pm2@4.5.1 (default)
            binary tools: pm2, pm2-dev, pm2-docker, pm2-runtime
            platform:
                runtime: node@15.5.1
                package manager: npm@built-in
        pnpm@5.15.0 (default)
            binary tools: pnpm, pnpx
            platform:
                runtime: node@15.5.1
                package manager: npm@built-in
```

So far so good.

### PNPM

The `pnpm` is the best node package ( and monorepo ) manager *der Welt*. At least this is true for javascript projects.

> pnpm uses a content-addressable filesystem to store all files from all module directories on a disk. When using npm or Yarn, if you have 100 projects using lodash, you will have 100 copies of lodash on disk. [ use `pnpm` and ] as a result, you save **gigabytes** of space on your disk and you have a lot faster installations!

Whenever you would like to type `npm` just type the `pnpm`.

Go see it's [documentation](https://pnpm.js.org/en/cli/install) meanwhile.

### PM2

> PM2 is a daemon process manager that will help you manage and keep your application online 24/7

That's all there is to it. You are invited to read through its docs [here](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).

Should you happen to want to see the configuration file that describes the cluster of the http servers the pm2 manages, you can always have a look at the [ecosystem.config.js](../ecosystem.config.js) file.

The `PM2` is used as the manager of the http server cluster within a container.

## HOW TO TEST IT ALL

You will come across the `specs` directories in each of the sub-project of this `monorepo`. They are where all the tests reside.

Being anywhere inside the root directory of this project type

```bash
pnpm --recursive run test
```

... to have all the tests run.

When you need to test a specific sub-project, just navigate to its directory and type

```bash
pnpm run test
```

## ETC

This project is hosted on [github](https://github.com/Dmitry-N-Medvedev/SDC).

Have a look at the [issues](https://github.com/Dmitry-N-Medvedev/SDC/issues), or [pull requests](https://github.com/Dmitry-N-Medvedev/SDC/pulls), or join the [discussions](https://github.com/Dmitry-N-Medvedev/SDC/discussions) section.

*have a nice day*
