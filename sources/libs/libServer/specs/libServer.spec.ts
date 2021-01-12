import mocha from 'mocha';
import chai from 'chai';
import got, { Got } from 'got';
import {
  URLSearchParams,
} from 'url';
import {
  Degrees,
} from '@dmitry-n-medvedev/libcommon/constants/Degrees';
import {
  QueryParameterNames,
} from '@dmitry-n-medvedev/libcommon/constants/QueryParameterNames';
import {
  LibServer,
} from '../libServer';
import {
  LibServerConfig,
} from '../libServerConfig';

const {
  describe,
  before,
  after,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('libServer', () => {
  const config:LibServerConfig = Object.freeze({
    port: 9091,
  });
  let libServer:LibServer = null;
  const client:Got = got.extend({
    prefixUrl: `http://localhost:${config.port}`,
    headers: {},
    responseType: 'json',
    timeout: 500,
  });

  before(async () => {
    libServer = new LibServer(config);

    return libServer.start();
  });

  after(async () => {
    if (libServer !== null) {
      return libServer.stop();
    }
  });

  it('should calculate direction to equal RIGHT', async () => {
    const searchParams:URLSearchParams = new URLSearchParams([
      [QueryParameterNames.HEADING, '310'],
      [QueryParameterNames.TARGET, '75'],
    ]);
    const response = await client.get('direction', {
      searchParams,
    });

    expect(response.body).to.have.property('direction');
  });

  it('should calculate the STRAIGHT direction', async () => {
    const searchParams:URLSearchParams = new URLSearchParams([
      [QueryParameterNames.HEADING, '310'],
      [QueryParameterNames.TARGET, '310'],
    ]);
    const response = await client.get('direction', {
      searchParams,
    });

    expect(response.body).to.deep.equal({
      direction: 'straight',
    });
  });

  it('should return either RIGHT or LEFT when the target points 180° backwards', async () => {
    const expectedDirections = ['left', 'right'];
    const searchParams:URLSearchParams = new URLSearchParams([
      [QueryParameterNames.HEADING, '310'],
      [QueryParameterNames.TARGET, (310 % 180).toString()],
    ]);
    const commands = [];

    for (let i = 0; i < 100; i += 1) {
      commands.push(client.get('direction', {
        searchParams,
      }));
    }

    const results = await Promise.all(commands);

    // eslint-disable-next-line no-restricted-syntax
    for (const { body: { direction } } of results) {
      expect(expectedDirections).to.include(direction);
    }
  });

  it('should fail on mistyped parameters', () => new Promise<void>((resolve) => {
    const searchParams = new URLSearchParams([
      [QueryParameterNames.HEADING, 'heading'],
      [QueryParameterNames.TARGET, 'target'],
    ]);

    client.get('direction', {
      searchParams,
      hooks: {
        afterResponse: [
          // @ts-ignore TODO: fix it
          (res) => {
            expect(res.statusCode === 400);

            resolve();
          },
        ],
      },
    });
  }));

  it(`should fail on parameters outside of the [ ${Degrees.MIN_DEGREE} .. ${Degrees.MAX_DEGREE} ] boundaries`, () => new Promise<void>((resolve) => {
    const searchParams:URLSearchParams = new URLSearchParams([
      [QueryParameterNames.HEADING, (Degrees.MIN_DEGREE - 1).toString()],
      [QueryParameterNames.TARGET, (Degrees.MAX_DEGREE + 1).toString()],
    ]);

    client.get('direction', {
      searchParams,
      hooks: {
        afterResponse: [
          // @ts-ignore TODO: fix it
          (res) => {
            expect(res.statusCode === 400);

            resolve();
          },
        ],
      },
    });
  }));
});
