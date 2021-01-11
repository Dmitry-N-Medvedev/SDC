import mocha from 'mocha';
import chai from 'chai';
import {
  Directions,
} from '../constants/Directions';

const {
  describe,
  it,
} = mocha;
const {
  expect,
} = chai;

describe('libCommon', () => {
  it('should verify the contents of Directions', async () => {
    expect(Directions.STRAIGHT).to.equal('straight');
    expect(Directions.LEFT).to.equal('left');
    expect(Directions.RIGHT).to.equal('right');
  });
});
