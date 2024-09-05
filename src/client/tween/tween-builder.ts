import { cloneTween, computeTweenTimes, type Tween } from './tween';
import { startTween } from './tween-runner';
import { type TweenTarget } from './tween-target';

class TweenBuilder {
  private _tween: Tween;
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
      duration: 0,
      durationPerIteration: 0,
      from: [],
      to: [],
    };
    this._initialValues = this._extractValues(initialValues);
  }

  delay(duration: number): this {
    this._tween.keyframes.push({
      to: [],
      from: [],
      startTime: this._tween.durationPerIteration,
      endTime: this._tween.durationPerIteration + duration,
      duration,
    });
    this._tween.durationPerIteration += duration;
    return this;
  }

  to(values: number | number[], duration: number, name?: string): this {
    const from =
      this._tween.to.length === 0 ? this._initialValues : this._tween.to;
    const to = this._extractValues(values);
    this._tween.keyframes.push({
      to,
      from,
      startTime: this._tween.durationPerIteration,
      endTime: this._tween.durationPerIteration + duration,
      duration,
      name,
    });
    this._tween.durationPerIteration += duration;
    this._tween.to = to;
    if (this._tween.from.length === 0) {
      this._tween.from = to;
    }
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
