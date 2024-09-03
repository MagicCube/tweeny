export interface TweenFrame {
  startTime: number;
  endTime: number;
  values: ReadonlyArray<number>;
}

export function cloneTweenFrame(frame: TweenFrame): TweenFrame {
  return {
    ...frame,
    values: [...frame.values],
  };
}
