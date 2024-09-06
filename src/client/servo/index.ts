import { BACK_LEFT, BACK_RIGHT, FRONT_LEFT, FRONT_RIGHT } from '../constants';

import { Servo } from './servo';

export * from './servo';

export const frontLeftServo = new Servo(FRONT_LEFT);
export const frontRightServo = new Servo(FRONT_RIGHT);
export const backLeftServo = new Servo(BACK_LEFT);
export const backRightServo = new Servo(BACK_RIGHT);

export const allServos = [
  frontLeftServo,
  frontRightServo,
  backLeftServo,
  backRightServo,
];
export const frontServos = [frontLeftServo, frontRightServo];
export const backServos = [backLeftServo, backRightServo];
export const leftServos = [frontLeftServo, backLeftServo];
export const rightServos = [frontRightServo, backRightServo];
export const diagonalServos1 = [frontLeftServo, backRightServo];
export const diagonalServos2 = [frontRightServo, backLeftServo];
export function updateServos() {
  allServos.forEach((servo) => servo.update());
}
