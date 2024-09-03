import { cloneTweenFrame, type TweenFrame } from './tween-frame';
import { type TweenIterationMode } from './tween-iteration-mode';
import { type TweenTarget } from './tween-target';

export interface Tween<T extends TweenTarget> {
  targets: ReadonlyArray<T>;
  propName: string;
  iterationCount: number;
  iterationMode: TweenIterationMode;
  keyframes: Readonly<TweenFrame>[];

  startTime: number;
  endTime: number;
}

export function cloneTween<T extends TweenTarget>(tween: Tween<T>): Tween<T> {
  return {
    ...tween,
    targets: [...tween.targets],
    keyframes: [...tween.keyframes.map(cloneTweenFrame)],
  };
}

export function computeTweenTimes(tween: Tween<TweenTarget>): void {
  if (!tween.keyframes.length) {
    tween.startTime = 0;
    tween.endTime = 0;
    return;
  }
  const firstFrame = tween.keyframes[0]!;
  const lastFrame = tween.keyframes[tween.keyframes.length - 1]!;
  tween.startTime = firstFrame.startTime;
  if (tween.iterationCount === Infinity) {
    tween.endTime = Infinity;
  } else {
    const duration = lastFrame.endTime;
    tween.endTime = duration * tween.iterationCount;
  }
}
