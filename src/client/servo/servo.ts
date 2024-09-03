import { setLegRotation as setLegRotation } from '../store';

// Minimum time between each update
const MIN_UPDATE_INTERVAL = 1000 / 60;

// degrees per millisecond, 0.12s per 60 degrees
const MAX_SPEED = 0.50625;

// +- 135 degrees
const MAX_ANGLE = 270 / 2;

export class Servo {
  private _angle = 0;
  private _targetAngle = 0;
  private _speed = MAX_SPEED;
  private _moving = false;
  private _lastUpdateTick = 0;

  constructor(readonly pin: number) {}

  get angle() {
    return this._angle;
  }

  get targetAngle() {
    return this._targetAngle;
  }

  get moving() {
    return this._moving;
  }

  get speed() {
    return this._speed;
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
    let elapsed = 0;
    if (this._lastUpdateTick) {
      elapsed = now - this._lastUpdateTick;
      if (elapsed < MIN_UPDATE_INTERVAL) {
        // Wait until the next tick
        return;
      }
    }

    this._update(elapsed);

    this._lastUpdateTick = now;
  }

  private _update(elapsed: number) {
    const movingDirection = Math.sign(this.targetAngle - this.angle);
    if (movingDirection) {
      const step = Math.min(
        this.speed * elapsed,
        Math.abs(this.targetAngle - this.angle),
      );
      this._immediatelySetAngle(this.angle + step * movingDirection);
      this._moving = true;
    } else {
      this._moving = false;
    }
  }

  private _immediatelySetAngle(angle: number) {
    this._angle = angle;
    setLegRotation(this.pin, angle);
  }
}
