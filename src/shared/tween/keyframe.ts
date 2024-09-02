import { type TweenTarget } from "./tween-target";

export interface Keyframe {
  target: TweenTarget;
  duration: number;
  value: number;
}
