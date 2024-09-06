'use client';

import { useEffect } from 'react';

import {
  allServos,
  diagonalServos1,
  diagonalServos2,
  frontLeftServo,
  updateServos,
  useStore,
} from '~/client';
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
    tween(allServos).to(90, 100).start();
    setTimeout(() => {
      tween(frontLeftServo)
        .to(-30, 500)
        .to(30, 500)
        .repeat(5)
        .chain(
          tween(allServos)
            .to([60, 120, 60, 120], 500)
            .to([120, 60, 120, 60], 500)
            .repeat(),
        )
        .start();
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
        <OrbitControls autoRotate autoRotateSpeed={-0.5} />
        <Scene />
      </Canvas>
    </div>
  );
}
