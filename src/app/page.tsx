'use client';

import { useEffect } from 'react';

import {
  allServos,
  diagonalServos1,
  diagonalServos2,
  updateServos,
  useStore,
} from '~/client';
import { tween } from '~/client/tween';
import { startTween, updateTweens } from '~/client/tween/tween-runner';
import { Canvas, OrbitControls, useFrame } from '~/three/react';

import { Robot } from './_components/robot';

function Scene() {
  const legRotations = useStore((state) => state.legRotations);
  useFrame(() => {
    updateTweens();
    updateServos();
  });
  useEffect(() => {
    tween(allServos, 0).to(90, 600).start();
    // which equal to
    setTimeout(() => {
      const t = tween(allServos, 90)
        .to([60, 120, 60, 120], 500)
        .delay(1000)
        .to([120, 60, 120, 60], 500)
        .delay(1000)
        .repeat()
        .build();
      console.info(t);
      startTween(t);
    }, 1000);
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
