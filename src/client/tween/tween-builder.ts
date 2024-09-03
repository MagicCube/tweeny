import { cloneTween, computeTweenTimes, type Tween } from './tween';
import { startTween } from './tween-runner';
import { type TweenTarget } from './tween-target';

class TweenBuilder<T extends TweenTarget> {
  private _tween: Tween<T>;
  private _timeOffset = 0;

  constructor(targets: T | T[], propName: string) {
    this._tween = {
      targets: Array.isArray(targets) ? targets : [targets],
      propName,
      iterationCount: 1,
      iterationMode: 'once',
      keyframes: [],
      startTime: 0,
      endTime: 0,
    };
  }

  delay(duration: number): this {
    this._timeOffset += duration;
    return this;
  }

  to(value: number | number[], duration: number): this {
    const lastFrame = this._tween.keyframes[this._tween.keyframes.length - 1];
    const startTime = lastFrame ? lastFrame.endTime : 0;
    const adjustedStartTime = startTime + this._timeOffset;
    let values: number[] = [];
    if (Array.isArray(value)) {
      if (value.length === this._tween.targets.length) {
        values = [...value];
      } else if (value.length === this._tween.targets.length / 2) {
        values = value.flatMap((v) => [v, v]);
      } else {
        throw new Error('Value array length must match target length');
      }
    } else {
      values = this._tween.targets.map(() => value);
    }
    this._tween.keyframes.push({
      values,
      startTime: adjustedStartTime,
      endTime: adjustedStartTime + duration,
    });
    this._timeOffset = 0; // Reset time offset after adding a keyframe
    return this;
  }

  repeat(iterationCount = Infinity): this {
    this._tween.iterationCount = iterationCount;
    this._tween.iterationMode = 'loop';
    return this;
  }

  yoyo(iterationCount = Infinity): this {
    this._tween.iterationCount = iterationCount;
    this._tween.iterationMode = 'yoyo';
    return this;
  }

  noRepeat(): this {
    this._tween.iterationCount = 1;
    this._tween.iterationMode = 'once';
    return this;
  }

  build(): Readonly<Tween<T>> {
    if (!this._tween.keyframes.length) {
      throw new Error('Tween must have at least one keyframe');
    }

    const result = cloneTween(this._tween);
    if (this._timeOffset > 0) {
      const lastFrame = result.keyframes[result.keyframes.length - 1]!;
      result.keyframes.push({
        startTime: lastFrame.endTime + this._timeOffset,
        endTime: lastFrame.endTime + this._timeOffset,
      });
    }
    computeTweenTimes(result);
    return result;
  }

  start() {
    const tween = this.build();
    startTween(tween);
    return tween;
  }
}

export function tween<T extends TweenTarget>(
  targets: T | T[],
  propName: string,
): TweenBuilder<T> {
  return new TweenBuilder(targets, propName);
}
