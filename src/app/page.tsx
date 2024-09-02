"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Robot } from "./_components/robot";
import { useState } from "react";

const STEP = 6;
const BASE = 90;
const AMPLITUDE = 30;

function Scene() {
  const [angle, setAngle] = useState(0);
  useFrame(() => {
    setAngle((angle) => angle + (STEP * Math.PI) / 180);
  });
  return (
    <Robot
      legRotations={{
        frontLeft: BASE - Math.sin(angle) * AMPLITUDE,
        frontRight: BASE + Math.sin(angle) * AMPLITUDE,
        backLeft: BASE + Math.sin(angle) * AMPLITUDE,
        backRight: BASE - Math.sin(angle) * AMPLITUDE,
      }}
    />
  );
}

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
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
        <OrbitControls />
        <Scene />
      </Canvas>
    </div>
  );
}
