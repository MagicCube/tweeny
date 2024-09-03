import { Servo } from './servo';

export * from './servo';

export const servos: [
  frontLeft: Servo,
  frontRight: Servo,
  backLeft: Servo,
  backRight: Servo,
] = [new Servo(0), new Servo(1), new Servo(2), new Servo(3)];
export const frontServos = [servos[0], servos[1]];
export const backServos = [servos[2], servos[3]];
export const leftServos = [servos[0], servos[2]];
export const rightServos = [servos[1], servos[3]];

export function updateServos() {
  servos.forEach((servo) => servo.update());
}
