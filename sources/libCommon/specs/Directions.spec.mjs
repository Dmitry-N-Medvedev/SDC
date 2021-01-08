import mocha from 'mocha';
import chai from 'chai';
import {
  Directions,
} from '../constants/Directions.mjs';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('libCommon', () => {
  it('should verify the contents of Directions', async () => {
    const directions = ['STRAIGHT', 'LEFT', 'RIGHT'];

    expect(Object.keys(Directions).length > 0).to.be.true;

    // eslint-disable-next-line no-restricted-syntax
    for (const direction of Object.keys(Directions)) {
      expect(directions).to.include(direction);
    }
  });
});
