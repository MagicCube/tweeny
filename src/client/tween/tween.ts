import { cloneTweenFrame, type TweenFrame } from './tween-frame';
import { type TweenIterationMode } from './tween-iteration-mode';
import { type TweenTarget } from './tween-target';

export interface Tween {
  targets: ReadonlyArray<TweenTarget>;
  iterationCount: number;
  iterationMode: TweenIterationMode;
  keyframes: TweenFrame[];

  from: number[];
  to: number[];

  duration: number;
  durationPerIteration: number;
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

export function cloneTweenFrames(tween: Tween) {
  return tween.keyframes.map(cloneTweenFrame);
}

export function yoyoTweenFrames(tween: Tween) {
  const frames = cloneTweenFrames(tween);
  const firstNonEmptyFrameIndex = frames.findIndex(
    (frame) => frame.to.length > 0,
  );
  if (firstNonEmptyFrameIndex !== -1) {
    for (let i = 0; i < firstNonEmptyFrameIndex + 1; i++) {
      frames.shift();
    }
    while (frames[0]?.to.length === 0) {
      frames.shift();
    }
  }
  frames.reverse();
  let timeOffset = 0;
  for (const frame of frames) {
    swap(frame);
    frame.startTime = timeOffset;
    frame.endTime = timeOffset + frame.duration;
    timeOffset = frame.endTime;
  }
  console.info(JSON.stringify(frames, null, 2));
  return frames;
}

export function swap<
  T extends { from: ReadonlyArray<number>; to: ReadonlyArray<number> },
>(target: T) {
  const from = target.from;
  target.from = target.to;
  target.to = from;
}
