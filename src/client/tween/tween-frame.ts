export enum TweenFrameType {
  Sleep = 0,
  MoveTo,
}

export interface GenericTweenFrame<T extends TweenFrameType = TweenFrameType> {
  name?: string;
  type: T;
  startTime: number;
  endTime: number;
  duration: number;
}

export interface MoveToFrame extends GenericTweenFrame<TweenFrameType.MoveTo> {
  type: TweenFrameType.MoveTo;
  from?: ReadonlyArray<number>;
  to: ReadonlyArray<number>;
}

export interface SleepFrame extends GenericTweenFrame<TweenFrameType.Sleep> {
  type: TweenFrameType.Sleep;
}

export type TweenFrame = MoveToFrame | SleepFrame;

export function cloneTweenFrame(frame: TweenFrame): TweenFrame {
  const result = {
    ...frame,
  };
  if (result.type === TweenFrameType.MoveTo) {
    result.from = result.from ? [...result.from] : undefined;
    result.to = [...result.to];
  }
  return result;
}
