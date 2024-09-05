export enum TweenFrameType {
  Sleep = 0,
  MoveTo,
}

export type TweenFrame = {
  type: TweenFrameType;
  startTime: number;
  endTime: number;
  duration: number;
  from: ReadonlyArray<number>;
  to: ReadonlyArray<number>;
  name?: string;
};

export function cloneTweenFrame(frame: TweenFrame): TweenFrame {
  return {
    ...frame,
    to: [...frame.to],
    from: [...frame.from],
  };
}
