'use client';

import { useEffect } from 'react';

import { servos, updateServos, useStore } from '~/client';
import { Canvas, OrbitControls, useFrame } from '~/three/react';

import { Robot } from './_components/robot';

let sign = 1;

function Scene() {
  const legRotations = useStore((state) => state.legRotations);
  useFrame(() => {
    updateServos();
  });
  useEffect(() => {
    setInterval(() => {
      servos[0].write(90 + sign * 30);
      servos[1].write(90 - sign * 30);
      servos[2].write(90 + sign * 30);
      servos[3].write(90 - sign * 30);
      sign *= -1;
    }, 500);
  }, []);
  return <Robot legRotations={legRotations} />;
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
        <axesHelper args={[100]} />
        <ambientLight intensity={0.66} />
        <pointLight position={[200, 200, 200]} />
        <OrbitControls />
        <Scene />
      </Canvas>
    </div>
  );
}
