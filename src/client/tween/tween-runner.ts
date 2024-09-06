import { type Tween } from './tween';
import { TweenFrameType } from './tween-frame';

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
  _updateTweens(now);
  lastUpdate = now;
}

function _updateTweens(now: number) {
  const toBeRemoved: RunnableTween[] = [];
  for (const tween of tweens) {
    const relativeTime = now - tween.offsetTime;
    if (relativeTime > tween.duration) {
      updateTween(tween, tween.duration);
      toBeRemoved.push(tween);
    } else if (relativeTime >= 0) {
      updateTween(tween, relativeTime);
    }
  }

  for (const tween of toBeRemoved) {
    if (tween.nextTween) {
      startTween(tween.nextTween);
    }
    const index = tweens.indexOf(tween);
    if (index !== -1) {
      tweens.splice(index, 1);
    }
  }
}

function updateTween(tween: RunnableTween, time: number) {
  const { iterations, relativeTime } = computeIterations(tween, time);
  const frameIndex = findFrameIndex(tween, { relativeTime });
  if (frameIndex === -1) {
    return;
  }
  const frame = tween.keyframes[frameIndex]!;
  if (frame.type === TweenFrameType.Sleep) {
    return;
  }

  let from = frame.from;
  const firstMoveFrameIndex = findFirstMoveFrameIndex(tween);
  if (firstMoveFrameIndex === frameIndex && iterations > 0) {
    from = tween.to;
  }
  const to = frame.to;
  let progress = (relativeTime - frame.startTime) / frame.duration;
  if (progress > 1) {
    progress = 1;
  } else if (progress < 0) {
    progress = 0;
  }
  tween.targets.forEach((target, i) => {
    const delta = to[i]! - from[i]!;
    const value = from[i]! + delta * progress;
    target.write(value);
  });
}

function findFrameIndex(
  tween: RunnableTween,
  { relativeTime }: { relativeTime: number },
) {
  if (tween.keyframes.length === 0) {
    return -1;
  }

  const frameIndex = tween.keyframes.findIndex(
    (f) => f.startTime <= relativeTime && f.endTime >= relativeTime,
  );
  return frameIndex;
}

function findFirstMoveFrameIndex(tween: RunnableTween) {
  return tween.keyframes.findIndex((f) => f.type === TweenFrameType.MoveTo);
}

function computeIterations(tween: RunnableTween, time: number) {
  let iterations = Math.floor(time / tween.durationPerIteration);
  if (time % tween.durationPerIteration === 0 && iterations > 0) {
    iterations--;
  }
  const relativeTime = time - iterations * tween.durationPerIteration;
  return { iterations, relativeTime };
}
