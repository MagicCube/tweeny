import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { type RobotLegRotations } from '../types';

type State = {
  legRotations: RobotLegRotations;
};

export const useStore = create<State>()(
  immer(() => ({
    legRotations: [0, 0, 0, 0],
  })),
);

export function setLegRotation(pin: number, angle: number) {
  useStore.setState((state) => {
    if (pin < 0 || pin > state.legRotations.length - 1) {
      throw new Error(`Invalid pin number: ${pin}`);
    }
    state.legRotations[pin] = angle;
  });
}
