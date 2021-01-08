import mocha from 'mocha';
import chai from 'chai';
import {
  calculateDirection,
} from '../calculateDirection.mjs';
import {
  Directions,
} from '../constants/Directions.mjs';
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

describe('libDirectionCalculator', () => {
  it('should calculate direction to equal RIGHT', async () => {
    const heading = 310;
    const target = 75;
    const expectedDirection = Directions.RIGHT;

    const calculatedDirection = calculateDirection(heading, target);

    expect(calculatedDirection).to.equal(expectedDirection);
  });

  it('should calculate the STRAIGHT direction', async () => {
    const heading = 310;
    const target = heading;
    const expectedDirection = Directions.STRAIGHT;

    const calculatedDirection = calculateDirection(heading, target);

    expect(calculatedDirection).to.equal(expectedDirection);
  });

  it('should return either RIGHT or LEFT when the target points 180° backwards', async () => {
    const heading = 310;
    const target = heading % 180;
    const expectedDirections = [Directions.LEFT, Directions.RIGHT];

    for (let i = 0; i < 100; i += 1) {
      const calculatedDirection = calculateDirection(heading, target);

      expect(expectedDirections).to.include(calculatedDirection);
    }
  });

  it('should fail on null/undefined parameters', async () => {
    const parameters = [
      [null, undefined],
      [undefined, null],
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const [heading, target] of parameters) {
      let error = null;

      try {
        calculateDirection(heading, target);
      } catch (undefinedError) {
        error = undefinedError;
      }

      expect(error).to.be.an.instanceof(ReferenceError);
    }
  });

  it('should fail on mistyped parameters', async () => {
    const heading = '310';
    const target = 75;

    let error = null;

    try {
      calculateDirection(heading, target);
    } catch (notANumberError) {
      error = notANumberError;
    }

    expect(error).to.be.instanceof(TypeError);
  });

  it(`should fail on parameters outside of the [ ${Degrees.MIN_DEGREE} .. ${Degrees.MAX_DEGREE} ] boundaries`, async () => {
    const parameters = [
      [Degrees.MIN_DEGREE - 1, Degrees.MIN_DEGREE],
      [Degrees.MAX_DEGREE + 1, Degrees.MAX_DEGREE],
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const [heading, target] of parameters) {
      let error = null;

      try {
        calculateDirection(heading, target);
      } catch (rangeError) {
        error = rangeError;
      }

      expect(error).to.be.an.instanceof(RangeError);
    }
  });
});
