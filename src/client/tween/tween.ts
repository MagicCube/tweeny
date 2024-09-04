import { cloneTweenFrame, type TweenFrame } from './tween-frame';
import { type TweenIterationMode } from './tween-iteration-mode';
import { type TweenTarget } from './tween-target';

export interface Tween {
  targets: ReadonlyArray<TweenTarget>;
  iterationCount: number;
  iterationMode: TweenIterationMode;
  keyframes: TweenFrame[];

  startTime: number;
  endTime: number;
  duration: number;
  durationPerIteration: number;
}

export function cloneTween(tween: Tween): Tween {
  return {
    ...tween,
    targets: [...tween.targets],
    keyframes: [...tween.keyframes.map(cloneTweenFrame)],
  };
}

export function computeTweenTimes(tween: Tween): void {
  if (!tween.keyframes.length) {
    tween.startTime = 0;
    tween.endTime = 0;
    tween.duration = 0;
    return;
  }
  const firstFrame = tween.keyframes[0]!;
  const lastFrame = tween.keyframes[tween.keyframes.length - 1]!;
  tween.startTime = firstFrame.startTime;
  tween.durationPerIteration = lastFrame.endTime;
  if (tween.iterationCount === Infinity) {
    tween.endTime = Infinity;
    tween.duration = Infinity;
  } else {
    const duration = lastFrame.endTime;
    tween.endTime = duration * tween.iterationCount;
    tween.duration = tween.endTime;
  }
}

export function yoyoTween(tween: Tween) {
  const lastNonEmptyFrame = tween.keyframes
    .slice()
    .reverse()
    .find((frame) => frame.duration > 0);
  if (!lastNonEmptyFrame) {
    throw new Error('Tween has no non-empty keyframes');
  }
  const lastValues = lastNonEmptyFrame.to;

  const result = cloneTween(tween);
  result.keyframes[0]!.from = lastValues;
  result.keyframes.reverse();
  for (const frame of result.keyframes) {
    const to = frame.from;
    frame.from = frame.to;
    frame.to = to;
    frame.startTime = tween.durationPerIteration - frame.endTime;
    frame.endTime = frame.startTime + frame.duration;
  }
  return result.keyframes;
}
