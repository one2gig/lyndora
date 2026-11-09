/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stage } from '@react-three/drei';
import { Cake } from './Cake';
import { useCakeStore } from '../../store/useCakeStore';
import { CakeDesign } from '../../types';

export function CakeScene({ design }: { design?: CakeDesign }) {
  const liveDesign = useCakeStore((state) => state.design);
  const cake = design ?? liveDesign;

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#fafafa] to-white">
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={35} />

          <Stage
            intensity={0.5}
            environment="city"
            adjustCamera={true}
            shadows={{ type: 'contact', opacity: 0.2, blur: 2 }}
          >
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
              <Cake design={cake} />
            </Float>
          </Stage>

          <OrbitControls
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            minDistance={3}
            maxDistance={12}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
