import util from 'util';
import mocha from 'mocha';
import chai from 'chai';
import which from 'which';
import execa from 'execa';
import got from 'got';
import {
  URLSearchParams,
} from 'url';
import {
  resolve,
} from 'path';
import {
  QueryParameterNames,
} from '@dmitry-n-medvedev/libcommon/constants/QueryParameterNames';

// eslint-disable-next-line no-unused-vars
const debuglog = util.debuglog('specs');
const {
  describe,
  before,
  after,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('HTTP Server', () => {
  const port = 9091;
  const client = got.extend({
    prefixUrl: `http://localhost:${port}`,
    headers: {},
    responseType: 'json',
    timeout: 500,
  });
  let node = null;
  let sdc = null;

  before(async () => {
    node = await which('node');

    expect(node).to.exist;

    // eslint-disable-next-line no-useless-catch
    sdc = execa(node, [resolve('./index.mjs')], {
      // shell: true,
      env: {
        NODE_DEBUG: 'SDC_SERVER',
        UWS_PORT: port.toString(),
      },
      extendEnv: true,
    });

    expect(sdc).to.exist;
  });

  after(async () => {
    if (sdc !== null) {
      sdc.kill('SIGTERM', {
        forceKillAfterTimeout: 500,
      });

      await sdc;
    }
  });

  // eslint-disable-next-line no-async-promise-executor
  it('should send request to the SDC Server', async () => new Promise(async (ok) => {
    // TODO: this `stdout` is a dirty hack. Will fix it later, too tired right now.
    const {
      // eslint-disable-next-line no-unused-vars
      stdout,
    } = sdc;

    const searchParams:URLSearchParams = new URLSearchParams([
      [QueryParameterNames.HEADING, '310'],
      [QueryParameterNames.TARGET, '75'],
    ]);

    const response = await client.get('direction', {
      searchParams,
      timeout: 1000,
    });

    expect(response.body).to.have.property('direction');

    debuglog(response.body);

    ok();
  })).timeout(0);
});
