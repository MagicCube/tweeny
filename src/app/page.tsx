"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import { BoxGeometry } from "three";
import { useState } from "react";

const BODY_LENGTH = 94,
  BODY_WIDTH = 70,
  BODY_HEIGHT = 33;
const LEG_LENGTH = 48,
  LEG_WIDTH = 8,
  LEG_HEIGHT = 6,
  LEG_JOINT_OFFSET_X = 8,
  LEG_JOINT_OFFSET_Y = LEG_LENGTH / 2;

function RobotBody() {
  return (
    <mesh>
      <lineSegments>
        <edgesGeometry
          args={[new BoxGeometry(BODY_LENGTH, BODY_HEIGHT, BODY_WIDTH)]}
        />
        <lineBasicMaterial color="black" />
      </lineSegments>
    </mesh>
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
    ? BODY_WIDTH / 2 + LEG_HEIGHT / 2
    : -BODY_WIDTH / 2 - LEG_HEIGHT / 2;

  return (
    <group position={[x, y, z]} rotation={[0, 0, rotation]}>
      <Box
        args={[LEG_WIDTH, LEG_LENGTH, LEG_HEIGHT]}
        position={[0, -LEG_JOINT_OFFSET_Y, 0]}
      >
        <meshPhongMaterial color="red" transparent opacity={0.9} />
      </Box>
    </group>
  );
}

function Robot() {
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

function Scene() {
  return (
    <Canvas
      className="bg-[#eee]"
      orthographic
      camera={{
        position: [0, 0, 200],
        zoom: 5, // Adjust this value to zoom in or out
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[200, 200, 200]} />
      <Robot />
      <OrbitControls />
    </Canvas>
  );
}

export default Scene;
