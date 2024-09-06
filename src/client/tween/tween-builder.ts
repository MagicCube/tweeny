import { cloneTween, computeTweenTimes, type Tween } from './tween';
import { TweenFrameType } from './tween-frame';
import { startTween } from './tween-runner';
import { type TweenTarget } from './tween-target';

class TweenBuilder {
  private _tween: Tween;
  private _nextTweenBuilder: TweenBuilder | null = null;

  constructor(targets: TweenTarget | TweenTarget[], name?: string) {
    const t = Array.isArray(targets) ? targets : [targets];
    this._tween = {
      name,
      targets: t,
      iterationCount: 1,
      keyframes: [],
      duration: 0,
      durationPerIteration: 0,
    };
  }

  to(values: number | number[], duration: number, name?: string): this {
    const from = this._tween.to;
    const to = this._extractValues(values);
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
    if (this._tween.to === undefined) {
      throw new Error('Tween must have at least one moveTo keyframe');
    }

    const result = cloneTween(this._tween);
    if (this._nextTweenBuilder) {
      result.nextTween = this._nextTweenBuilder.build();
    }
    computeTweenTimes(result);
    return result;
  }

  chain(next: TweenBuilder) {
    this._nextTweenBuilder = next;
    return this;
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
  name?: string,
): TweenBuilder {
  return new TweenBuilder(targets, name);
}
