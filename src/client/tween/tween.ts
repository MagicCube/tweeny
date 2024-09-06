import { cloneTweenFrame, type TweenFrame } from './tween-frame';
import { type TweenTarget } from './tween-target';

export interface Tween {
  name?: string;
  targets: ReadonlyArray<TweenTarget>;
  keyframes: Readonly<TweenFrame>[];
  from: number[];
  to: number[];
  iterationCount: number;
  duration: number;
  durationPerIteration: number;
  nextTween?: Tween | null | undefined;
}

export function cloneTweenFrames(tween: Tween) {
  return tween.keyframes.map(cloneTweenFrame);
}

export function cloneTween(tween: Tween): Tween {
  return {
    ...tween,
    targets: [...tween.targets],
    keyframes: cloneTweenFrames(tween),
  };
}

export function computeTweenTimes(tween: Tween): void {
  tween.duration = tween.durationPerIteration * tween.iterationCount;
}
