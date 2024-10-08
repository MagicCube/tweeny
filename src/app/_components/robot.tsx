'use client';

import { memo } from 'react';

import {
  BACK_LEFT,
  BACK_RIGHT,
  FRONT_LEFT,
  FRONT_RIGHT,
  type RobotLegRotations,
} from '~/client';
import { Edges } from '~/three/react';

import { ExtrudeSVG } from './extrude-svg';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BODY_LENGTH = 94;
const BODY_WIDTH = 70;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BODY_HEIGHT = 33;
const LEG_LENGTH = 48;
const LEG_WIDTH = 8;
const LEG_THICKNESS = 6;
const LEG_OFFSET_X = LEG_WIDTH;

export function Robot({ legRotations }: { legRotations: RobotLegRotations }) {
  return (
    <group>
      <RobotBody />
      <RobotLeg front left rotation={legRotations[FRONT_LEFT]} color="blue" />
      <RobotLeg front right rotation={legRotations[FRONT_RIGHT]} color="blue" />
      <RobotLeg back left rotation={legRotations[BACK_LEFT]} color="red" />
      <RobotLeg back right rotation={legRotations[BACK_RIGHT]} color="red" />
    </group>
  );
}

const RobotBody = memo(() => (
  <ExtrudeSVG depth={BODY_WIDTH}>
    <svg>
      <path d="M8.27565 0H85.9081L94 8.09188V25.0918L86.0918 33H8.09193L0.0918789 25L0 25.0918V8.09188L0.0918884 8.18377L8.27565 0Z" />
    </svg>
    <meshPhongMaterial color="silver" transparent opacity={0.96} />
    <Edges color="black" />
  </ExtrudeSVG>
));
RobotBody.displayName = 'RobotBody';

const RobotLeg = memo(
  ({
    color = 'red',
    left = false,
    front = false,
    rotation = 0,
  }: {
    color?: string;
    left?: boolean;
    right?: boolean;
    front?: boolean;
    back?: boolean;
    rotation?: number;
  }) => {
    const x = front ? LEG_LENGTH - LEG_OFFSET_X : -LEG_LENGTH + LEG_OFFSET_X;
    const y = 0;
    const z = left
      ? -BODY_WIDTH / 2 - LEG_THICKNESS / 2
      : BODY_WIDTH / 2 + LEG_THICKNESS / 2;

    rotation = rotation % 360;
    if (rotation < -135) {
      rotation = -135;
    } else if (rotation > 135) {
      rotation = 135;
    }
    const degree = 180 - rotation;

    return (
      <group position={[x, y, z]} rotation={[0, 0, (Math.PI / 180) * degree]}>
        <LegMesh color={color} />
      </group>
    );
  },
);
RobotLeg.displayName = 'RobotLeg';

const LegMesh = memo(({ color = 'red' }: { color?: string }) => (
  <ExtrudeSVG
    depth={LEG_THICKNESS}
    position={[-LEG_LENGTH / 2 + LEG_WIDTH / 2, 0, 0]}
  >
    <svg>
      <rect width={LEG_LENGTH} height={LEG_WIDTH} ry={LEG_WIDTH / 2} />
    </svg>
    <meshPhongMaterial color={color} />
    <Edges color="black" />
  </ExtrudeSVG>
));
LegMesh.displayName = 'LegMesh';
