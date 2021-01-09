import mocha from 'mocha';
import chai from 'chai';
import {
  Degrees,
} from '../constants/Degrees.mjs';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('libCommon', () => {
  it('should verify the contents of the Degrees', async () => {
    const degrees = ['MIN_DEGREE', 'MAX_DEGREE'];

    expect(Object.keys(Degrees).length > 0).to.be.true;

    // eslint-disable-next-line no-restricted-syntax
    for (const degree of Object.keys(Degrees)) {
      expect(degrees).to.include(degree);
    }
  });
});
