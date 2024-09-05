'use client';

import { useEffect } from 'react';

import {
  allServos,
  diagonalServos1,
  diagonalServos2,
  updateServos,
  useStore,
} from '~/client';
import {
  type Tween,
  tween,
  type TweenFrame,
  yoyoTweenFrames,
} from '~/client/tween';
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
    tween(allServos, 0).to(90, 600).start();
    // which equal to
    setTimeout(() => {
      tween(allServos, 90)
        .to(60, 500, '1) 90-60')
        .delay(1000)
        .to(90, 500, '2) 60-90')
        .delay(1000)
        .to(120, 500, '3) 90-120')
        .delay(500)
        .yoyo(4)
        .start();
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

function outputFrames(frames: TweenFrame[]) {
  for (const keyframe of frames) {
    if (keyframe.to.length === 0) {
      console.info(`delay(${keyframe.duration})`);
    } else {
      console.info(
        `${keyframe.from[0]} - ${keyframe.to[0]} in ${keyframe.duration}ms`,
      );
    }
  }
}
