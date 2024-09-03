'use client';

import { useEffect } from 'react';

import { servos, updateServos, useStore } from '~/client';
import { tween } from '~/client/tween';
import { updateTweens } from '~/client/tween/tween-runner';
import { Canvas, OrbitControls, useFrame } from '~/three/react';

import { Robot } from './_components/robot';

function Scene() {
  const legRotations = useStore((state) => state.legRotations);
  useFrame(() => {
    updateTweens();
    updateServos();
  });
  useEffect(() => {
    console.info(
      tween(servos, 'rotation')
        .delay(1000)
        .to(90, 1000)
        .delay(1000)
        .to(180, 1000)
        .delay(1000)
        // .repeat(2)
        .start(),
    );
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
