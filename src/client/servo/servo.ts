import { setLegRotations } from '../store';
import { type RobotLegRotations } from '../types';

// Minimum time between each update
const MIN_UPDATE_TICK_TIME = 1000 / 60;

// Milliseconds per degree, 0.12s per 60 degrees
const MAX_SPEED = 0.50625;

// +- 135 degrees
const MAX_ANGLE = 270 / 2;

export class Servo {
  private _angle = 0;
  private _targetAngle = 0;
  private _moving = false;
  private _movingDirection = 0;
  private _lastTick = 0;

  constructor(readonly name: keyof RobotLegRotations) {}

  get angle() {
    return this._angle;
  }

  get targetAngle() {
    return this._targetAngle;
  }

  get moving() {
    return this._moving;
  }

  get movingDirection() {
    return this._movingDirection;
  }

  write(angle: number) {
    const targetAngle = Math.min(Math.max(-MAX_ANGLE, angle % 360), MAX_ANGLE);
    this._targetAngle = targetAngle;
  }

  reset() {
    this.write(0);
  }

  update() {
    const now = Date.now();
    this._movingDirection = Math.sign(this.targetAngle - this._angle);
    if (this._movingDirection !== 0) {
      let elapsed = 0;
      if (this._lastTick) {
        elapsed = now - this._lastTick;
      }

      if (this._lastTick !== 0 && elapsed < MIN_UPDATE_TICK_TIME) {
        // Wait until the next tick
        return;
      }

      const step = Math.min(
        MAX_SPEED * elapsed,
        Math.abs(this._targetAngle - this._angle),
      );
      this._write(this._angle + step * this.movingDirection);
      this._moving = true;
      this._lastTick = now;
    } else {
      this._moving = false;
    }
  }

  private _write(angle: number) {
    this._angle = angle;
    setLegRotations({ [this.name]: angle });
  }
}
