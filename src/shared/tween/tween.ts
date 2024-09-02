import { type Keyframe } from "./keyframe";
import { type TweenTarget } from "./tween-target";

export class Tween {
  constructor(target: TweenTarget) {}

  readonly keyframes: Keyframe[] = [];

  to(value: number, duration: number) {}
}
