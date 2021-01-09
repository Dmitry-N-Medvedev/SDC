import util from 'util';
import {
  config,
} from 'dotenv';
import {
  LibServer,
} from '@dmitry-n-medvedev/libserver/libServer.mjs';

config();

const LOG_ALL_DOMAIN = '';
const debuglog = util.debuglog(process.env.NODE_DEBUG ?? LOG_ALL_DOMAIN); // process.env.NODE_DEBUG ?? LOG_ALL_DOMAIN
const port = parseInt(process.env.UWS_PORT, 10);

debuglog('process.env.NODE_DEBUG:', process.env.NODE_DEBUG);
debuglog('process.env.UWS_PORT:', process.env.UWS_PORT);

if (Number.isNaN(port) === true) {
  debuglog('UWS_PORT environment variable is undefined. Exiting now.');

  // eslint-disable-next-line no-process-exit
  process.exit(0);
}

let libServer = null;

const exitNow = async () => {
  if (libServer !== null) {
    await libServer.stop();

    libServer = null;
  }

  // eslint-disable-next-line no-process-exit
  process.exit(0);
};

process.once('uncaughtException', exitNow);
process.once('unhandledRejection', exitNow);
process.on('SIGINT', exitNow);
process.on('SIGTERM', exitNow);
process.on('SIGHUP', exitNow);

(async () => {
  libServer = new LibServer({
    port,
  });

  await libServer.start();

  debuglog(`started on ${port} port`);
})();
