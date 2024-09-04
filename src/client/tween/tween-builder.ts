import { cloneTween, computeTweenTimes, type Tween } from './tween';
import { startTween } from './tween-runner';
import { type TweenTarget } from './tween-target';

class TweenBuilder {
  private _tween: Tween;
  private _timeOffset = 0;
  private _initialValues: number[] = [];

  constructor(
    targets: TweenTarget | TweenTarget[],
    initialValues: number | number[],
  ) {
    this._tween = {
      targets: Array.isArray(targets) ? targets : [targets],
      iterationCount: 1,
      iterationMode: 'once',
      keyframes: [],
      startTime: 0,
      endTime: 0,
      duration: 0,
      durationPerIteration: 0,
    };
    this._initialValues = this._extractValues(initialValues);
  }

  delay(duration: number): this {
    this._timeOffset += duration;
    return this;
  }

  to(values: number | number[], duration: number): this {
    const lastFrame = this._tween.keyframes[this._tween.keyframes.length - 1];
    const startTime = (lastFrame ? lastFrame.endTime : 0) + this._timeOffset;
    const endTime = startTime + duration;
    const from = lastFrame?.to ?? this._initialValues;
    const to = this._extractValues(values);
    this._tween.keyframes.push({
      to,
      from,
      startTime,
      endTime,
      duration,
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

  build(): Readonly<Tween> {
    if (!this._tween.keyframes.length) {
      throw new Error('Tween must have at least one keyframe');
    }

    const result = cloneTween(this._tween);
    if (this._timeOffset > 0) {
      const lastFrame = result.keyframes[result.keyframes.length - 1]!;
      result.keyframes.push({
        startTime: lastFrame.endTime + this._timeOffset,
        endTime: lastFrame.endTime + this._timeOffset,
        duration: 0,
        from: [],
        to: [],
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

  private _extractValues(values: number | number[]): number[] {
    let results: number[] = [];
    if (Array.isArray(values)) {
      if (values.length === this._tween.targets.length) {
        results = [...values];
      } else if (values.length === this._tween.targets.length / 2) {
        results = values.flatMap((v) => [v, v]);
      } else {
        throw new Error('Value array length must match target length');
      }
    } else {
      results = this._tween.targets.map(() => values);
    }
    return results;
  }
}

export function tween(
  targets: TweenTarget | TweenTarget[],
  values: number | number[],
): TweenBuilder {
  return new TweenBuilder(targets, values);
}
