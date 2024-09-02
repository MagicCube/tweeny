"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { Robot } from "./_components/robot";

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
