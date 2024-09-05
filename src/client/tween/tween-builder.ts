import { cloneTween, computeTweenTimes, type Tween } from './tween';
import { TweenFrameType } from './tween-frame';
import { startTween } from './tween-runner';
import { type TweenTarget } from './tween-target';

class TweenBuilder {
  private _tween: Tween;
  private _initialValues: number[] = [];

  constructor(
    targets: TweenTarget | TweenTarget[],
    initialValues: number | number[],
    name?: string,
  ) {
    this._tween = {
      name,
      targets: Array.isArray(targets) ? targets : [targets],
      iterationCount: 1,
      keyframes: [],
      from: [],
      to: [],
      duration: 0,
      durationPerIteration: 0,
    };
    this._initialValues = this._extractValues(initialValues);
    this._tween.from = this._initialValues;
    this._tween.to = this._initialValues;
  }

  private _firstMoveToFrame = true;
  to(values: number | number[], duration: number, name?: string): this {
    const from = this._tween.to;
    const to = this._extractValues(values);
    if (this._firstMoveToFrame) {
      this._tween.from = to;
      this._firstMoveToFrame = false;
    }
    this._tween.keyframes.push({
      type: TweenFrameType.MoveTo,
      name,
      to,
      from,
      startTime: this._tween.durationPerIteration,
      endTime: this._tween.durationPerIteration + duration,
      duration,
    });
    this._tween.durationPerIteration += duration;
    this._tween.to = to;
    return this;
  }

  delay(duration: number, name?: string): this {
    this._tween.keyframes.push({
      type: TweenFrameType.Sleep,
      name,
      to: [],
      from: [],
      startTime: this._tween.durationPerIteration,
      endTime: this._tween.durationPerIteration + duration,
      duration,
    });
    this._tween.durationPerIteration += duration;
    return this;
  }

  repeat(iterationCount = Infinity): this {
    this._tween.iterationCount = iterationCount;
    return this;
  }

  noRepeat(): this {
    this._tween.iterationCount = 1;
    return this;
  }

  build(): Readonly<Tween> {
    if (!this._tween.keyframes.length) {
      throw new Error('Tween must have at least one keyframe');
    }

    const result = cloneTween(this._tween);
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
  name?: string,
): TweenBuilder {
  return new TweenBuilder(targets, values, name);
}
