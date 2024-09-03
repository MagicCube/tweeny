import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { type RobotLegRotations } from '../types';

type State = {
  legRotations: RobotLegRotations;
};

export const useStore = create<State>()(
  immer(() => ({
    legRotations: {
      frontLeft: 0,
      frontRight: 0,
      backLeft: 0,
      backRight: 0,
    },
  })),
);

export function setLegRotations(legRotations: Partial<RobotLegRotations>) {
  useStore.setState((state) => {
    state.legRotations = { ...state.legRotations, ...legRotations };
  });
}
