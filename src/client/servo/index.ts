import { BACK_LEFT, BACK_RIGHT, FRONT_LEFT, FRONT_RIGHT } from '../constants';

import { Servo } from './servo';

export * from './servo';

export const servos: [
  frontLeft: Servo,
  frontRight: Servo,
  backLeft: Servo,
  backRight: Servo,
] = [
  new Servo(FRONT_LEFT),
  new Servo(FRONT_RIGHT),
  new Servo(BACK_LEFT),
  new Servo(BACK_RIGHT),
];
export const frontServos = [servos[FRONT_LEFT], servos[FRONT_RIGHT]];
export const backServos = [servos[BACK_LEFT], servos[BACK_RIGHT]];
export const leftServos = [servos[FRONT_LEFT], servos[BACK_LEFT]];
export const rightServos = [servos[FRONT_RIGHT], servos[BACK_RIGHT]];

export function updateServos() {
  servos.forEach((servo) => servo.update());
}
