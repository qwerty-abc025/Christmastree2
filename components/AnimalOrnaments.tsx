import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTreeConePoint, getRandomSpherePoint } from '../utils/math';

interface AnimalOrnamentsProps {
  progress: React.MutableRefObject<number>;
  onInteract: () => void;
}

const AnimalGroup: React.FC<{
  type: string;
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  progress: React.MutableRefObject<number>;
}> = ({ type, chaosPos, targetPos, progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const randomOffset = useRef(Math.random() * 100);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const t = progress.current;
    // Cubic easing
    const easedT = 1 - Math.pow(1 - t, 3);

    // Interpolate Position
    groupRef.current.position.x = THREE.MathUtils.lerp(chaosPos[0], targetPos[0], easedT);
    groupRef.current.position.y = THREE.MathUtils.lerp(chaosPos[1], targetPos[1], easedT);
    groupRef.current.position.z = THREE.MathUtils.lerp(chaosPos[2], targetPos[2], easedT);

    // Look at center when formed, random rotation when chaos
    // Simple lookAt logic: vector to center (0, y, 0)
    if (t > 0.5) {
        groupRef.current.lookAt(0, groupRef.current.position.y, 0);
        // Correct rotation because models face +Z usually
        groupRef.current.rotateY(Math.PI); 
    } else {
        groupRef.current.rotation.x = clock.getElapsedTime() + randomOffset.current;
        groupRef.current.rotation.z = clock.getElapsedTime() * 0.5;
    }

    // Bobbing animation
    if (t > 0.8) {
      groupRef.current.position.y += Math.sin(clock.getElapsedTime() * 2 + randomOffset.current) * 0.05;
      // Gentle sway
      groupRef.current.rotation.z += Math.sin(clock.getElapsedTime() * 1.5 + randomOffset.current) * 0.05;
    }
  });

  const renderAnimal = () => {
    switch (type) {
      case 'PANDA': return <PandaMesh />;
      case 'LION': return <LionMesh />;
      case 'MONKEY': return <MonkeyMesh />;
      case 'PIG': return <PigMesh />;
      case 'CAPYBARA': return <CapybaraMesh />;
      case 'RABBIT': return <RabbitMesh />;
      case 'BEAR': return <BearMesh />;
      case 'TIGER': return <TigerMesh />;
      case 'GOLDEN_MONKEY': return <GoldenMonkeyMesh />;
      case 'HIPPO': return <HippoMesh />;
      case 'WHALE': return <WhaleMesh />;
      case 'SHARK': return <SharkMesh />;
      case 'POLAR_BEAR': return <PolarBearMesh />;
      case 'PENGUIN': return <PenguinMesh />;
      default: return null;
    }
  };

  return (
    <group ref={groupRef} scale={0.55}>
      {renderAnimal()}
    </group>
  );
};

// --- ANIMAL GEOMETRIES ---

const PandaMesh = () => (
  <group>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.45, 0.45, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#111111" roughness={0.9} />
    </mesh>
    <mesh position={[0.45, 0.45, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#111111" roughness={0.9} />
    </mesh>
    {/* Eyes */}
    <mesh position={[-0.2, 0.1, 0.5]} rotation={[0.2, 0, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#111111" roughness={0.9} />
    </mesh>
    <mesh position={[0.2, 0.1, 0.5]} rotation={[0.2, 0, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#111111" roughness={0.9} />
    </mesh>
    {/* Nose */}
    <mesh position={[0, -0.1, 0.55]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color="#111111" />
    </mesh>
  </group>
);

const LionMesh = () => (
  <group>
    {/* Mane */}
    <mesh position={[0, 0, -0.1]}>
      <torusGeometry args={[0.6, 0.2, 16, 32]} />
      <meshStandardMaterial color="#FF8C00" roughness={1} />
    </mesh>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial color="#D4AF37" roughness={0.8} />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.4, 0.4, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#D4AF37" />
    </mesh>
    <mesh position={[0.4, 0.4, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#D4AF37" />
    </mesh>
    {/* Snout */}
    <mesh position={[0, -0.1, 0.45]} scale={[1, 0.8, 0.5]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#FFFFFF" />
    </mesh>
     <mesh position={[0, -0.05, 0.56]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  </group>
);

const MonkeyMesh = () => (
  <group>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#8B4513" roughness={0.9} />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.5, 0.1, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#D2691E" roughness={0.9} />
    </mesh>
    <mesh position={[0.5, 0.1, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#D2691E" roughness={0.9} />
    </mesh>
    {/* Face Mask */}
    <mesh position={[0, 0.05, 0.35]}>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color="#F4A460" roughness={0.9} />
    </mesh>
    {/* Eyes */}
    <mesh position={[-0.12, 0.15, 0.6]} scale={[1,1,0.5]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#000" />
    </mesh>
    <mesh position={[0.12, 0.15, 0.6]} scale={[1,1,0.5]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#000" />
    </mesh>
  </group>
);

const PigMesh = () => (
  <group>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.55, 32, 32]} />
      <meshStandardMaterial color="#FFB6C1" roughness={0.6} />
    </mesh>
    {/* Snout */}
    <mesh position={[0, -0.05, 0.45]} rotation={[Math.PI/2, 0, 0]}>
      <cylinderGeometry args={[0.15, 0.15, 0.15, 32]} />
      <meshStandardMaterial color="#FF69B4" />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.3, 0.45, 0]} rotation={[0, 0, 0.5]}>
      <coneGeometry args={[0.15, 0.3, 32]} />
      <meshStandardMaterial color="#FFB6C1" />
    </mesh>
    <mesh position={[0.3, 0.45, 0]} rotation={[0, 0, -0.5]}>
      <coneGeometry args={[0.15, 0.3, 32]} />
      <meshStandardMaterial color="#FFB6C1" />
    </mesh>
  </group>
);

const CapybaraMesh = () => (
  <group>
    {/* Head (Boxy) */}
    <mesh position={[0, 0, 0.1]}>
      <boxGeometry args={[0.5, 0.6, 0.8]} />
      <meshStandardMaterial color="#8B4513" roughness={0.8} />
    </mesh>
    {/* Snout */}
    <mesh position={[0, -0.1, 0.55]}>
      <boxGeometry args={[0.4, 0.3, 0.3]} />
      <meshStandardMaterial color="#5D4037" roughness={0.9} />
    </mesh>
    {/* Chill Eyes */}
    <mesh position={[-0.15, 0.1, 0.51]}>
        <boxGeometry args={[0.1, 0.02, 0.05]} />
        <meshBasicMaterial color="#000" />
    </mesh>
     <mesh position={[0.15, 0.1, 0.51]}>
        <boxGeometry args={[0.1, 0.02, 0.05]} />
        <meshBasicMaterial color="#000" />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.2, 0.3, -0.1]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#5D4037" />
    </mesh>
     <mesh position={[0.2, 0.3, -0.1]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#5D4037" />
    </mesh>
  </group>
);

const RabbitMesh = () => (
  <group>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#E0E0E0" roughness={0.9} />
    </mesh>
    {/* Ears (Long) */}
    <mesh position={[-0.2, 0.6, 0]} rotation={[0, 0, -0.1]}>
      <capsuleGeometry args={[0.12, 0.6, 4, 16]} />
      <meshStandardMaterial color="#E0E0E0" roughness={0.9} />
    </mesh>
    <mesh position={[0.2, 0.6, 0]} rotation={[0, 0, 0.1]}>
      <capsuleGeometry args={[0.12, 0.6, 4, 16]} />
      <meshStandardMaterial color="#E0E0E0" roughness={0.9} />
    </mesh>
    {/* Pink Nose */}
    <mesh position={[0, -0.05, 0.45]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#FF69B4" />
    </mesh>
  </group>
);

const BearMesh = () => (
  <group>
    <mesh>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#5D4037" roughness={0.9} />
    </mesh>
    {/* Snout */}
    <mesh position={[0, -0.15, 0.45]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color="#8D6E63" roughness={0.9} />
    </mesh>
    <mesh position={[0, -0.1, 0.65]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.45, 0.45, 0]}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#5D4037" roughness={0.9} />
    </mesh>
    <mesh position={[0.45, 0.45, 0]}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#5D4037" roughness={0.9} />
    </mesh>
  </group>
);

const PolarBearMesh = () => (
  <group>
    <mesh>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#F0F8FF" roughness={0.8} />
    </mesh>
    {/* Snout */}
    <mesh position={[0, -0.15, 0.45]}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshStandardMaterial color="#E0F7FA" roughness={0.8} />
    </mesh>
    <mesh position={[0, -0.1, 0.65]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.45, 0.45, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#F0F8FF" roughness={0.8} />
    </mesh>
    <mesh position={[0.45, 0.45, 0]}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#F0F8FF" roughness={0.8} />
    </mesh>
  </group>
);

const TigerMesh = () => (
  <group>
    <mesh>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#FF9800" roughness={0.8} />
    </mesh>
    {/* Stripes (Torus rings hack) */}
    <mesh rotation={[Math.PI/2, 0, 0]} scale={0.58}>
       <torusGeometry args={[1, 0.05, 16, 32]} />
       <meshStandardMaterial color="#222" />
    </mesh>
    <mesh rotation={[Math.PI/2, 0.5, 0]} scale={0.58}>
       <torusGeometry args={[1, 0.05, 16, 32]} />
       <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} scale={0.4}>
       <torusGeometry args={[1, 0.08, 16, 32]} />
       <meshStandardMaterial color="#222" />
    </mesh>
    
    {/* Ears */}
    <mesh position={[-0.45, 0.45, 0]}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#FF9800" />
    </mesh>
    <mesh position={[0.45, 0.45, 0]}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#FF9800" />
    </mesh>
    {/* Snout */}
    <mesh position={[0, -0.15, 0.45]}>
      <sphereGeometry args={[0.22, 32, 32]} />
      <meshStandardMaterial color="#FFF" />
    </mesh>
  </group>
);

const GoldenMonkeyMesh = () => (
  <group>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#D4AF37" roughness={0.5} metalness={0.2} />
    </mesh>
    {/* Blue Face */}
    <mesh position={[0, 0.05, 0.35]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#87CEEB" roughness={0.6} />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.5, 0.1, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#FFA500" roughness={0.9} />
    </mesh>
    <mesh position={[0.5, 0.1, 0]}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="#FFA500" roughness={0.9} />
    </mesh>
    {/* Eyes */}
    <mesh position={[-0.1, 0.1, 0.6]} scale={0.8}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#000" />
    </mesh>
    <mesh position={[0.1, 0.1, 0.6]} scale={0.8}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="#000" />
    </mesh>
  </group>
);

const HippoMesh = () => (
  <group>
    {/* Head */}
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#9FA8DA" roughness={0.7} />
    </mesh>
    {/* Big Snout */}
    <mesh position={[0, -0.2, 0.4]}>
      <boxGeometry args={[0.6, 0.4, 0.5]} />
      <meshStandardMaterial color="#C5CAE9" roughness={0.7} />
    </mesh>
    {/* Nostrils */}
    <mesh position={[-0.15, -0.05, 0.65]}>
       <sphereGeometry args={[0.05, 16, 16]} />
       <meshStandardMaterial color="#5C6BC0" />
    </mesh>
    <mesh position={[0.15, -0.05, 0.65]}>
       <sphereGeometry args={[0.05, 16, 16]} />
       <meshStandardMaterial color="#5C6BC0" />
    </mesh>
    {/* Ears */}
    <mesh position={[-0.3, 0.45, 0]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#9FA8DA" />
    </mesh>
    <mesh position={[0.3, 0.45, 0]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#9FA8DA" />
    </mesh>
  </group>
);

const WhaleMesh = () => (
  <group>
    {/* Body */}
    <mesh scale={[1, 0.6, 1.5]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#03A9F4" roughness={0.4} />
    </mesh>
    {/* Belly */}
    <mesh position={[0, -0.2, 0]} scale={[0.9, 0.5, 1.4]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial color="#E1F5FE" roughness={0.6} />
    </mesh>
    {/* Tail */}
    <group position={[0, 0, -0.8]} rotation={[0.5, 0, 0]}>
       <mesh position={[-0.3, 0, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial color="#03A9F4" />
       </mesh>
       <mesh position={[0.3, 0, 0]} rotation={[0, 0, -0.5]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshStandardMaterial color="#03A9F4" />
       </mesh>
    </group>
  </group>
);

const SharkMesh = () => (
  <group>
    {/* Body */}
    <mesh scale={[0.8, 0.8, 1.8]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#B0BEC5" roughness={0.5} />
    </mesh>
    {/* Fin */}
    <mesh position={[0, 0.4, 0.2]} rotation={[-0.5, 0, 0]}>
       <coneGeometry args={[0.05, 0.6, 16]} />
       <meshStandardMaterial color="#B0BEC5" />
    </mesh>
    {/* Eyes */}
    <mesh position={[-0.3, 0.1, 0.6]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#000" />
    </mesh>
    <mesh position={[0.3, 0.1, 0.6]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color="#000" />
    </mesh>
  </group>
);

const PenguinMesh = () => (
  <group>
    {/* Body */}
    <mesh scale={[0.8, 1.2, 0.8]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#212121" roughness={0.7} />
    </mesh>
    {/* Belly */}
    <mesh position={[0, 0, 0.25]} scale={[0.6, 1, 0.4]}>
       <sphereGeometry args={[0.5, 32, 32]} />
       <meshStandardMaterial color="#FFF" roughness={0.9} />
    </mesh>
    {/* Beak */}
    <mesh position={[0, 0.3, 0.45]} rotation={[Math.PI/2, 0, 0]}>
       <coneGeometry args={[0.08, 0.2, 16]} />
       <meshStandardMaterial color="#FFC107" />
    </mesh>
    {/* Eyes */}
    <mesh position={[-0.15, 0.4, 0.38]}>
       <sphereGeometry args={[0.04, 16, 16]} />
       <meshBasicMaterial color="#000" />
    </mesh>
    <mesh position={[0.15, 0.4, 0.38]}>
       <sphereGeometry args={[0.04, 16, 16]} />
       <meshBasicMaterial color="#000" />
    </mesh>
  </group>
);


const AnimalOrnaments: React.FC<AnimalOrnamentsProps> = ({ progress, onInteract }) => {
  const animals = useMemo(() => {
    // Expanded list of animals
    const types = [
      'PANDA', 'LION', 'MONKEY', 'PIG', 'CAPYBARA', 'RABBIT',
      'BEAR', 'TIGER', 'GOLDEN_MONKEY', 'HIPPO', 'WHALE', 'SHARK', 'POLAR_BEAR', 'PENGUIN'
    ];
    
    return types.map((type, i) => {
      // Calculate a stable target position on the tree
      // Distribute in UPPER HALF (Local Y range ~1.5 to 5.5)
      // We have 14 animals now. We need to spread them carefully so they don't overlap.
      
      // Use Golden Angle for even distribution on a sphere/cone surface
      const phi = Math.PI * (3 - Math.sqrt(5)); // ~2.399...
      const yNorm = 1 - (i / (types.length - 1)); // 1 to 0
      
      // Map to height range: 5.0 to 9.5 (Upper section)
      const height = 5.0 + yNorm * 4.5; 
      
      const radiusAtHeight = 4.2 * (1 - height / 12); 
      const theta = phi * i * 8; // Multiply to spin around more

      const x = Math.cos(theta) * radiusAtHeight;
      const z = Math.sin(theta) * radiusAtHeight;
      const y = height - 4; // Adjust to model local space

      // Push out slightly
      const vec = new THREE.Vector3(x, 0, z).normalize().multiplyScalar(0.6);

      return {
        type,
        targetPos: [x + vec.x, y, z + vec.z] as [number, number, number],
        chaosPos: getRandomSpherePoint(14)
      };
    });
  }, []);

  return (
    <group onClick={(e) => { e.stopPropagation(); onInteract(); }}>
      {animals.map((anim, i) => (
        <AnimalGroup 
          key={anim.type}
          type={anim.type}
          chaosPos={anim.chaosPos}
          targetPos={anim.targetPos}
          progress={progress}
        />
      ))}
    </group>
  );
};

export default AnimalOrnaments;