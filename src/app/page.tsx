'use client';

import { Servo, useStore } from '~/client';
import { Canvas, OrbitControls, useFrame } from '~/three/react';

import { Robot } from './_components/robot';
import { useEffect } from 'react';

const servo1 = new Servo('frontLeft');
const servo2 = new Servo('frontRight');
const servo3 = new Servo('backLeft');
const servo4 = new Servo('backRight');

function Scene() {
  const legRotations = useStore((state) => state.legRotations);
  useFrame(() => {
    // TODO: Move legs
    servo1.update();
    servo2.update();
    servo3.update();
    servo4.update();
  });
  useEffect(() => {
    servo1.write(90);
    servo2.write(135);
    servo3.write(90);
    servo4.write(-135);
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
