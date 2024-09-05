export type TweenFrame = {
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
