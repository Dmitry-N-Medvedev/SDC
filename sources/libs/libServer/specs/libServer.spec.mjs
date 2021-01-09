import mocha from 'mocha';
import chai from 'chai';
import got from 'got';
import {
  Degrees,
} from '@dmitry-n-medvedev/libcommon/constants/Degrees.mjs';
import {
  LibServer,
} from '../libServer.mjs';

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
  const config = Object.freeze({
    port: 9091,
  });
  let libServer = null;
  const client = got.extend({
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

    return Promise.resolve();
  });

  it('should calculate direction to equal RIGHT', async () => {
    const searchParams = new URLSearchParams([
      ['heading', 310],
      ['target', 75],
    ]);
    const response = await client.get('direction', {
      searchParams,
    });

    expect(response.body).to.have.property('direction');
  });

  it('should calculate the STRAIGHT direction', async () => {
    const searchParams = new URLSearchParams([
      ['heading', 310],
      ['target', 310],
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
    const searchParams = new URLSearchParams([
      ['heading', 310],
      ['target', 310 % 180],
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

  it('should fail on mistyped parameters', () => new Promise((resolve) => {
    const searchParams = new URLSearchParams([
      ['heading', 'heading'],
      ['target', 'target'],
    ]);

    client.get('direction', {
      searchParams,
      hooks: {
        afterResponse: [
          (res) => {
            expect(res.statusCode === 400);

            resolve();
          },
        ],
      },
    });
  }));

  it(`should fail on parameters outside of the [ ${Degrees.MIN_DEGREE} .. ${Degrees.MAX_DEGREE} ] boundaries`, () => new Promise((resolve) => {
    const searchParams = new URLSearchParams([
      ['heading', Degrees.MIN_DEGREE - 1],
      ['target', Degrees.MAX_DEGREE + 1],
    ]);

    client.get('direction', {
      searchParams,
      hooks: {
        afterResponse: [
          (res) => {
            expect(res.statusCode === 400);

            resolve();
          },
        ],
      },
    });
  }));
});
