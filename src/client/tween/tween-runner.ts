import { type Tween } from './tween';

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
      toBeRemoved.push(tween);
      updateTween(tween, tween.endTime);
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
  // TODO:
}
