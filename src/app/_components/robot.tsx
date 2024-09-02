import { useFrame } from "@react-three/fiber";
import { Box, Edges } from "@react-three/drei";
import { useState } from "react";

import { ExtrudeSVG } from "./extrude-svg";

const BODY_LENGTH = 94,
  BODY_WIDTH = 70,
  BODY_HEIGHT = 33;
const LEG_LENGTH = 48,
  LEG_WIDTH = 8,
  LEG_THICKNESS = 6,
  LEG_JOINT_OFFSET_X = 8,
  LEG_JOINT_OFFSET_Y = LEG_LENGTH / 2 - LEG_WIDTH / 2;

export function Robot() {
  const [angle, setAngle] = useState(0);

  useFrame(() => {
    setAngle(angle + 0.1);
  });

  return (
    <group>
      {/* Body */}
      <RobotBody />

      {/* Legs */}
      <RobotLeg front left rotation={-Math.sin(angle) * 0.66} />
      <RobotLeg front right rotation={Math.sin(angle) * 0.66} />
      <RobotLeg back left rotation={Math.sin(angle) * 0.66} />
      <RobotLeg back right rotation={-Math.sin(angle) * 0.66} />
    </group>
  );
}

function RobotBody() {
  return (
    <Box args={[BODY_LENGTH, BODY_HEIGHT, BODY_WIDTH]}>
      <meshPhongMaterial color="silver" transparent opacity={0.95} />
      <Edges color="black" />
    </Box>
  );
}

function RobotLeg({
  front = false,
  left = false,
  rotation = 0,
}: {
  front?: boolean;
  back?: boolean;
  left?: boolean;
  right?: boolean;
  rotation?: number;
}) {
  const x = left
    ? -BODY_LENGTH / 2 + LEG_WIDTH / 2 + LEG_JOINT_OFFSET_X
    : BODY_LENGTH / 2 - LEG_WIDTH / 2 - LEG_JOINT_OFFSET_X;
  const y = -LEG_LENGTH / 2 + LEG_JOINT_OFFSET_Y;
  const z = front
    ? BODY_WIDTH / 2 + LEG_THICKNESS / 2 + 1
    : -BODY_WIDTH / 2 - LEG_THICKNESS / 2 - 1;

  return (
    <group position={[x, y, z]} rotation={[0, 0, rotation]}>
      <ExtrudeSVG depth={LEG_THICKNESS} position={[0, -LEG_JOINT_OFFSET_Y, 0]}>
        <svg>
          <rect
            x={0}
            y={0}
            width={LEG_WIDTH}
            height={LEG_LENGTH}
            rx={LEG_WIDTH / 2}
          />
        </svg>
        <meshPhongMaterial color="red" />
        <Edges color="black" />
      </ExtrudeSVG>
    </group>
  );
}
