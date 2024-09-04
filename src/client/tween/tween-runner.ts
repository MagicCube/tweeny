import {
  cloneTween,
  yoyoTween as reverseTweenKeyframes,
  type Tween,
} from './tween';
import { type TweenFrame } from './tween-frame';

const tweens: RunnableTween[] = [];

interface RunnableTween extends Tween {
  offsetTime: number;
}

export function startTween(tween: Readonly<Tween>) {
  const runnableTween = tween as unknown as RunnableTween;
  runnableTween.offsetTime = Date.now();
  tweens.push(runnableTween);
}

let lastUpdate = 0;
const MINIMUM_UPDATE_INTERVAL = 1000 / 60;
export function updateTweens() {
  if (tweens.length === 0) {
    return;
  }
  const now = Date.now();
  const elapsed = lastUpdate === 0 ? 0 : now - lastUpdate;
  if (lastUpdate !== 0 && elapsed < MINIMUM_UPDATE_INTERVAL) {
    // Skip update
    return;
  }

  const toBeRemoved: RunnableTween[] = [];
  for (const tween of tweens) {
    const relativeTime = now - tween.offsetTime;
    if (relativeTime > tween.endTime) {
      updateTween(tween, tween.endTime);
      toBeRemoved.push(tween);
    } else if (relativeTime >= tween.startTime) {
      updateTween(tween, relativeTime);
    }
  }
  for (const tween of toBeRemoved) {
    const index = tweens.indexOf(tween);
    if (index !== -1) {
      tweens.splice(index, 1);
    }
  }

  lastUpdate = now;
}

function updateTween(tween: RunnableTween, time: number) {
  const { iterations, direction, relativeTime } = computeIterations(
    tween,
    time,
  );
  const frame = getCurrentFrame(tween, { iterations, direction, relativeTime });
  if (!frame || frame.duration === 0) {
    return;
  }

  let progress = (relativeTime - frame.startTime) / frame.duration;
  if (progress > 1) {
    progress = 1;
  } else if (progress < 0) {
    progress = 0;
  }
  for (let i = 0; i < tween.targets.length; i++) {
    const delta = frame.to[i]! - frame.from[i]!;
    const value = frame.from[i]! + delta * progress;
    tween.targets[i]!.write(value);
  }
}

function getCurrentFrame(
  tween: RunnableTween,
  {
    iterations,
    direction,
    relativeTime,
  }: { iterations: number; direction: number; relativeTime: number },
) {
  let frames: TweenFrame[];
  if (direction === 1) {
    frames = cloneTween(tween).keyframes;
    if (iterations > 0) {
      const lastNonEmptyFrame = frames
        .slice()
        .reverse()
        .find((f) => f.duration > 0);
      if (lastNonEmptyFrame) {
        const lastValues = lastNonEmptyFrame.to;
        frames[0]!.from = lastValues;
      }
    }
  } else {
    frames = reverseTweenKeyframes(tween);
  }

  const frame = frames.find(
    (f) => f.startTime <= relativeTime && f.endTime >= relativeTime,
  );
  return frame;
}

function computeIterations(tween: RunnableTween, time: number) {
  let iterations = Math.floor(time / tween.durationPerIteration);
  if (time % tween.durationPerIteration === 0 && iterations > 0) {
    iterations--;
  }
  let direction = 1;
  if (tween.iterationMode === 'yoyo') {
    direction = iterations % 2 === 0 ? 1 : -1;
  }
  const relativeTime = time - iterations * tween.durationPerIteration;
  return { iterations, direction, relativeTime };
}
