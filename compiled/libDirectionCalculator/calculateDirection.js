"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDirection = void 0;
const Directions_1 = require("@dmitry-n-medvedev/libcommon/constants/Directions");
const Degrees_1 = require("@dmitry-n-medvedev/libcommon/constants/Degrees");
const BACKWARDS_DEGREE = (Degrees_1.Degrees.MIN_DEGREE + Degrees_1.Degrees.MAX_DEGREE) / 2;
const calculateDirection = (heading = null, target = null) => {
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
    if (heading < Degrees_1.Degrees.MIN_DEGREE || heading > Degrees_1.Degrees.MAX_DEGREE) {
        throw new RangeError(`invalid heading value: ${heading}. It is outside of the [ ${Degrees_1.Degrees.MIN_DEGREE} .. ${Degrees_1.Degrees.MAX_DEGREE} ] boundaries.`);
    }
    if (target < Degrees_1.Degrees.MIN_DEGREE || target > Degrees_1.Degrees.MAX_DEGREE) {
        throw new RangeError(`invalid target value: ${target}. It is outside of the [ ${Degrees_1.Degrees.MIN_DEGREE} .. ${Degrees_1.Degrees.MAX_DEGREE} ] boundaries.`);
    }
    if (heading === target) {
        return Directions_1.Directions.STRAIGHT;
    }
    if (target === Math.floor(heading % BACKWARDS_DEGREE)) {
        return Math.random() < 0.5 ? Directions_1.Directions.LEFT : Directions_1.Directions.RIGHT;
    }
    return target < Math.floor(heading % BACKWARDS_DEGREE) ? Directions_1.Directions.RIGHT : Directions_1.Directions.LEFT;
};
exports.calculateDirection = calculateDirection;
//# sourceMappingURL=calculateDirection.js.map