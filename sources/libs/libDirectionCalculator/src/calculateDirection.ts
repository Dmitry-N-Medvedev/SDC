import {
  Directions,
} from '@dmitry-n-medvedev/libcommon/src/constants/Directions';
import {
  Degrees,
} from '@dmitry-n-medvedev/libcommon/src/constants/Degrees';

const BACKWARDS_DEGREE = (Degrees.MIN_DEGREE + Degrees.MAX_DEGREE) / 2;

export const calculateDirection = (heading:number = null, target:number = null): Directions => {
  if (heading === null) {
    throw new ReferenceError('heading is undefined');
  }

  if (target === null) {
    throw new ReferenceError('target is undefined');
  }

  if (typeof heading !== 'number' || Number.isNaN(heading) === true) {
    throw new TypeError('heading is not a number');
  }

  if (typeof target !== 'number' || Number.isNaN(target) === true) {
    throw new TypeError('target is not a number');
  }

  heading = Math.floor(heading);
  target = Math.floor(target);

  if (heading < Degrees.MIN_DEGREE || heading > Degrees.MAX_DEGREE) {
    throw new RangeError(`invalid heading value: ${heading}. It is outside of the [ ${Degrees.MIN_DEGREE} .. ${Degrees.MAX_DEGREE} ] boundaries.`);
  }

  if (target < Degrees.MIN_DEGREE || target > Degrees.MAX_DEGREE) {
    throw new RangeError(`invalid target value: ${target}. It is outside of the [ ${Degrees.MIN_DEGREE} .. ${Degrees.MAX_DEGREE} ] boundaries.`);
  }

  if (heading === target) {
    return Directions.STRAIGHT;
  }

  if (target === Math.floor(heading % BACKWARDS_DEGREE)) {
    return Math.random() < 0.5 ? Directions.LEFT : Directions.RIGHT;
  }

  return target < Math.floor(heading % BACKWARDS_DEGREE) ? Directions.RIGHT : Directions.LEFT;
};
