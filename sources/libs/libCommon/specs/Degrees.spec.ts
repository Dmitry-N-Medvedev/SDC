import mocha from 'mocha';
import chai from 'chai';
import {
  Degrees,
} from '../constants/Degrees';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('libCommon', () => {
  it('should verify the contents of the Degrees', async () => {
    expect(Degrees.MIN_DEGREE).to.equal(0);
    expect(Degrees.MAX_DEGREE).to.equal(359);
  });
});
