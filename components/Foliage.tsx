import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTreeConePoint, getRandomSpherePoint } from '../utils/math';

interface FoliageProps {
  count: number;
  progress: React.MutableRefObject<number>; // 0 (chaos) to 1 (formed)
  onInteract: () => void;
}

// Custom Shader for high-performance particle interpolation
const FoliageShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColor1: { value: new THREE.Color('#004225') }, // Deep Emerald
    uColor2: { value: new THREE.Color('#0B6623') }, // Forest Green
    uGold: { value: new THREE.Color('#D4AF37') },   // Darker Gold
  },
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    attribute vec3 aChaosPos;
    attribute vec3 aTargetPos;
    attribute float aSize;
    attribute float aType; // 0 for green, 1 for gold tip

    varying vec3 vColor;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uGold;

    // Cubic easing for smoother start/stop
    float easeOutCubic(float x) {
      return 1.0 - pow(1.0 - x, 3.0);
    }

    void main() {
      // Interpolate position
      float t = easeOutCubic(uProgress);
      vec3 pos = mix(aChaosPos, aTargetPos, t);

      // Add "breathing" wind effect when formed
      if (uProgress > 0.8) {
        float wind = sin(uTime * 2.0 + pos.y * 0.5) * 0.05;
        pos.x += wind;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      gl_PointSize = aSize * (300.0 / -mvPosition.z);

      // Color mixing
      if (aType > 0.8) {
         vColor = uGold * 1.5; // Brighter gold
      } else {
         vColor = mix(uColor1, uColor2, sin(pos.y + uTime));
      }
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    void main() {
      // Circular particle
      vec2 coord = gl_PointCoord - vec2(0.5);
      if (length(coord) > 0.5) discard;
      
      // Simple lighting gradient
      float strength = 1.0 - length(coord) * 2.0;
      gl_FragColor = vec4(vColor * strength * 2.0, 1.0);
    }
  `
};

const Foliage: React.FC<FoliageProps> = ({ count, progress, onInteract }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate Data
  const { positions, chaosPositions, targetPositions, sizes, types } = useMemo(() => {
    const chaos = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const tp = new Float32Array(count);
    const pos = new Float32Array(count * 3); // Initial positions (dummy)

    for (let i = 0; i < count; i++) {
      // Target: Cone with slight top cutoff (0.05) to avoid sharp black tip
      const [tx, ty, tz] = getTreeConePoint(12, 4.5, -4, 0.08);
      target[i * 3] = tx;
      target[i * 3 + 1] = ty;
      target[i * 3 + 2] = tz;

      // Chaos: Sphere
      const [cx, cy, cz] = getRandomSpherePoint(15);
      chaos[i * 3] = cx;
      chaos[i * 3 + 1] = cy;
      chaos[i * 3 + 2] = cz;

      // Size
      sz[i] = Math.random() * 0.4 + 0.1;

      // Type (10% Gold Glitter)
      tp[i] = Math.random() > 0.9 ? 1.0 : 0.0;
    }

    return { 
      positions: pos, 
      chaosPositions: chaos, 
      targetPositions: target, 
      sizes: sz, 
      types: tp 
    };
  }, [count]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uProgress.value = progress.current;
    }
  });

  return (
    <points onClick={(e) => { e.stopPropagation(); onInteract(); }}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aChaosPos"
          count={chaosPositions.length / 3}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTargetPos"
          count={targetPositions.length / 3}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aType"
          count={types.length}
          array={types}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[FoliageShaderMaterial]}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Foliage;