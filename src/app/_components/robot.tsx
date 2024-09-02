import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { memo, useState } from "react";

import { ExtrudeSVG } from "./extrude-svg";

const BODY_LENGTH = 94;
const BODY_WIDTH = 70;
// const BODY_HEIGHT = 33;
const LEG_LENGTH = 48;
const LEG_WIDTH = 8;
const LEG_THICKNESS = 6;
const LEG_JOINT_OFFSET_X = 8;
const LEG_JOINT_OFFSET_Y = LEG_LENGTH / 2 - LEG_WIDTH / 2;

export function Robot() {
  const [angle, setAngle] = useState(0);

  useFrame(() => {
    setAngle(angle + 0.1);
  });

  return (
    <group>
      <RobotBody />
      <RobotLeg front left rotation={-Math.sin(angle) * 0.66} color="blue" />
      <RobotLeg front right rotation={Math.sin(angle) * 0.66} color="blue" />
      <RobotLeg back left rotation={Math.sin(angle) * 0.66} color="red" />
      <RobotLeg back right rotation={-Math.sin(angle) * 0.66} color="red" />
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
RobotBody.displayName = "RobotBody";

function RobotLeg({
  color = "red",
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
}) {
  const x = front
    ? -BODY_LENGTH / 2 + LEG_WIDTH / 2 + LEG_JOINT_OFFSET_X
    : BODY_LENGTH / 2 - LEG_WIDTH / 2 - LEG_JOINT_OFFSET_X;
  const y = -LEG_LENGTH / 2 + LEG_JOINT_OFFSET_Y;
  const z = left
    ? BODY_WIDTH / 2 + LEG_THICKNESS / 2 + 0.4
    : -BODY_WIDTH / 2 - LEG_THICKNESS / 2 - 0.4;

  return (
    <group position={[x, y, z]} rotation={[0, 0, rotation]}>
      <LegMesh color={color} />
    </group>
  );
}

const LegMesh = memo(({ color = "red" }: { color?: string }) => (
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
    <meshPhongMaterial color={color} />
    <Edges color="black" />
  </ExtrudeSVG>
));
LegMesh.displayName = "LegMesh";
