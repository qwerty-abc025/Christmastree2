import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTreeConePoint, getRandomSpherePoint } from '../utils/math';
import { OrnamentData } from '../types';

interface OrnamentsProps {
  progress: React.MutableRefObject<number>;
  onInteract: () => void;
}

const Ornaments: React.FC<OrnamentsProps> = ({ progress, onInteract }) => {
  const meshBallsRef = useRef<THREE.InstancedMesh>(null);
  const meshBoxesRef = useRef<THREE.InstancedMesh>(null);
  const meshLightsRef = useRef<THREE.InstancedMesh>(null);

  const BALL_COUNT = 150;
  const BOX_COUNT = 40;
  const LIGHT_COUNT = 60;

  // --- Data Generation ---
  const ballsData = useMemo(() => generateOrnamentData(BALL_COUNT, 'BALL'), []);
  const boxesData = useMemo(() => generateOrnamentData(BOX_COUNT, 'BOX'), []);
  const lightsData = useMemo(() => generateOrnamentData(LIGHT_COUNT, 'LIGHT'), []);

  // --- Helper to generate static data ---
  function generateOrnamentData(count: number, type: 'BALL' | 'BOX' | 'LIGHT'): OrnamentData[] {
    const data: OrnamentData[] = [];
    const colors = [
      '#D4AF37', // Darker Metallic Gold
      '#C41E3A', // Cardinal Red
      '#FFFFFF', // Silver/White
      '#B8860B'  // Dark Goldenrod
    ];

    for (let i = 0; i < count; i++) {
      // Tree position logic
      // Height Limit: Keep top clear for Miffy (Max height ~7.5)
      let maxH = 7.5;
      
      // STRICT FILTER: Lights must be lower to avoid blooming Miffy's face
      if (type === 'LIGHT') {
        maxH = 6.0;
      }

      const [tx, ty, tz] = getTreeConePoint(maxH, 4.2, -3.5);
      
      // Push slightly outward normal
      const vec = new THREE.Vector3(tx, 0, tz).normalize().multiplyScalar(0.3);
      
      const chaos = getRandomSpherePoint(18);

      let scale;
      if (type === 'LIGHT') {
        scale = 0.15;
      } else {
        // Reduced scale for balls/boxes
        scale = Math.random() * 0.2 + 0.15; 
      }

      data.push({
        id: i,
        chaosPos: chaos,
        targetPos: [tx + vec.x, ty, tz + vec.z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: scale,
        color: type === 'LIGHT' ? '#FFFDD0' : colors[Math.floor(Math.random() * colors.length)],
        type
      });
    }
    return data;
  }

  // --- Animation Loop ---
  useFrame(({ clock }) => {
    const p = progress.current;
    
    // Easing function for smoother movement
    const easedP = 1 - Math.pow(1 - p, 3); // Cubic out

    const dummy = new THREE.Object3D();

    // Animate Balls
    if (meshBallsRef.current) {
      ballsData.forEach((item, i) => {
        const { chaosPos, targetPos, rotation, scale } = item;
        
        dummy.position.set(
          chaosPos[0] + (targetPos[0] - chaosPos[0]) * easedP,
          chaosPos[1] + (targetPos[1] - chaosPos[1]) * easedP,
          chaosPos[2] + (targetPos[2] - chaosPos[2]) * easedP
        );

        dummy.rotation.set(
          rotation[0] + clock.getElapsedTime() * 0.1,
          rotation[1] + clock.getElapsedTime() * 0.2,
          rotation[2]
        );
        
        dummy.scale.setScalar(scale * (0.8 + 0.2 * Math.sin(clock.getElapsedTime() + i)));
        dummy.updateMatrix();
        meshBallsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshBallsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate Boxes
    if (meshBoxesRef.current) {
      boxesData.forEach((item, i) => {
        const { chaosPos, targetPos, rotation, scale } = item;
         dummy.position.set(
          chaosPos[0] + (targetPos[0] - chaosPos[0]) * easedP,
          chaosPos[1] + (targetPos[1] - chaosPos[1]) * easedP,
          chaosPos[2] + (targetPos[2] - chaosPos[2]) * easedP
        );
        dummy.rotation.set(rotation[0], rotation[1] + easedP * Math.PI * 2, rotation[2]);
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        meshBoxesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshBoxesRef.current.instanceMatrix.needsUpdate = true;
    }
    
    // Animate Lights
    if (meshLightsRef.current) {
       lightsData.forEach((item, i) => {
        const { chaosPos, targetPos, scale } = item;
         dummy.position.set(
          chaosPos[0] + (targetPos[0] - chaosPos[0]) * easedP,
          chaosPos[1] + (targetPos[1] - chaosPos[1]) * easedP,
          chaosPos[2] + (targetPos[2] - chaosPos[2]) * easedP
        );
        // Twinkle effect
        const twinkle = Math.sin(clock.getElapsedTime() * 3 + i * 10) * 0.5 + 0.5;
        dummy.scale.setScalar(scale * (0.5 + twinkle));
        dummy.updateMatrix();
        meshLightsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshLightsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // --- Initial Color Setup ---
  useLayoutEffect(() => {
    const color = new THREE.Color();
    
    if (meshBallsRef.current) {
      ballsData.forEach((item, i) => {
        meshBallsRef.current!.setColorAt(i, color.set(item.color));
      });
      meshBallsRef.current.instanceColor!.needsUpdate = true;
    }
    if (meshBoxesRef.current) {
      boxesData.forEach((item, i) => {
        meshBoxesRef.current!.setColorAt(i, color.set(item.color));
      });
      meshBoxesRef.current.instanceColor!.needsUpdate = true;
    }
    if (meshLightsRef.current) {
      lightsData.forEach((item, i) => {
        meshLightsRef.current!.setColorAt(i, color.set('#FFFACD').multiplyScalar(1.5)); // High intensity
      });
      meshLightsRef.current.instanceColor!.needsUpdate = true;
    }
  }, [ballsData, boxesData, lightsData]);

  const handleInteraction = (e: any) => {
    e.stopPropagation();
    onInteract();
  };

  return (
    <group onClick={handleInteraction}>
      {/* Glossy Balls */}
      <instancedMesh ref={meshBallsRef} args={[undefined, undefined, BALL_COUNT]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
            roughness={0.4} 
            metalness={0.6} 
            envMapIntensity={1.2}
        />
      </instancedMesh>

      {/* Gift Boxes */}
      <instancedMesh ref={meshBoxesRef} args={[undefined, undefined, BOX_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
            roughness={0.5} 
            metalness={0.3} 
            envMapIntensity={0.8}
        />
      </instancedMesh>

      {/* Lights */}
      <instancedMesh ref={meshLightsRef} args={[undefined, undefined, LIGHT_COUNT]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};

export default Ornaments;