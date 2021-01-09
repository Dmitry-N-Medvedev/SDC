import util from 'util';
import uWS from 'uWebSockets.js';
import {
  handleDirection,
} from './handlers/handleDirection.mjs';

const debuglog = util.debuglog('LIB_SERVER');

export class LibServer {
  #config = null;
  #server = null;
  #handle = null;

  constructor(config = null) {
    if (config === null) {
      throw new ReferenceError('config is undefined');
    }

    if (Object.keys(config).length === 0) {
      throw new TypeError('config is empty');
    }

    this.#config = Object.freeze({ ...config });

    debuglog('config:', JSON.stringify(this.#config));
  }

  async start() {
    if (this.#server !== null) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.#server = uWS.App({})
        .get('/direction', handleDirection)
        .listen(this.#config.port, (handle) => {
          if (typeof handle === 'undefined') {
            reject(new Error(`failed to start on ${this.#config.port} port`));
          }

          this.#handle = handle;

          debuglog(`started on ${this.#config.port} port`);
          resolve();
        });
    });
  }

  async stop() {
    if (this.#server === null) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      if (this.#handle !== null) {
        uWS.us_listen_socket_close(this.#handle);

        this.#handle = null;
        this.#server = null;

        debuglog(`stopped listening on ${this.#config.port} port`);
        resolve();
      }
    });
  }
}
