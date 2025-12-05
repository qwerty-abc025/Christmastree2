
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { getRandomSpherePoint } from '../utils/math';
import { PHOTO_PATHS } from '../assets/photoData';

interface PhotoOrnamentsProps {
  progress: React.MutableRefObject<number>;
  onInteract: () => void;
}

// Inner component to handle Texture Loading safely
const PhotoMesh = ({ textureUrl }: { textureUrl: string }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    loader.load(
      textureUrl,
      (loadedTex) => {
        loadedTex.center.set(0.5, 0.5);
        loadedTex.rotation = 0;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearFilter;
        setTexture(loadedTex);
        setHasError(false);
      },
      undefined,
      (err) => {
        // Silently fail to black to keep aesthetics
        console.warn(`Failed to load: ${textureUrl}`);
        setHasError(true);
      }
    );
  }, [textureUrl]);
  
  return (
    <group scale={1.2}>
      {/* Frame / Backing */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.4, 0.05]} />
        <meshStandardMaterial color="#F0F0F0" roughness={0.8} />
      </mesh>
      
      {/* Photo Texture Plane or Black Fallback */}
      <mesh position={[0, 0.1, 0.031]}>
        <planeGeometry args={[1, 1]} />
        
        {/* LOGIC: If texture exists and no error, show it. Otherwise show sleek Black Replacement */}
        {!hasError && texture ? (
           <meshBasicMaterial map={texture} toneMapped={false} />
        ) : (
           // The "Black Replacement" - a sleek, dark, reflective surface
           <meshStandardMaterial color="#111111" roughness={0.2} metalness={0.8} />
        )}
      </mesh>
  
      {/* Clip/String detail at top */}
      <mesh position={[0, 0.8, 0]}>
         <torusGeometry args={[0.1, 0.02, 8, 16]} />
         <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const PhotoGroup: React.FC<{
  id: number;
  chaosPos: [number, number, number];
  targetPos: [number, number, number];
  progress: React.MutableRefObject<number>;
  delay: number;
  isActive: boolean;
  onActivate: (e: any) => void;
  textureUrl: string;
}> = ({ id, chaosPos, targetPos, progress, delay, isActive, onActivate, textureUrl }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetVec = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    // --- ZOOM STATE ---
    if (isActive) {
      // Calculate position directly in front of camera
      const vector = new THREE.Vector3(0, 0, -8); // 8 units in front
      vector.applyMatrix4(camera.matrixWorld);
      
      // Lerp to camera front
      groupRef.current.position.lerp(vector, 0.1);
      
      // Look at camera
      groupRef.current.lookAt(camera.position);
      
      return;
    }

    // --- NORMAL STATE (Tree/Chaos) ---
    const t = progress.current;
    const easedT = 1 - Math.pow(1 - t, 3); // Cubic easing

    // Calculate desired position based on tree state
    const x = THREE.MathUtils.lerp(chaosPos[0], targetPos[0], easedT);
    const y = THREE.MathUtils.lerp(chaosPos[1], targetPos[1], easedT);
    const z = THREE.MathUtils.lerp(chaosPos[2], targetPos[2], easedT);
    
    targetVec.current.set(x, y, z);
    
    // Lerp current position to target
    groupRef.current.position.lerp(targetVec.current, 0.1);
    
    // Rotation Logic
    if (t > 0.5) {
        // Formed: Look at center (billboard effect around tree)
        groupRef.current.lookAt(0, groupRef.current.position.y, 0);
        
        // Add slight sway
        groupRef.current.rotation.z += Math.sin(clock.getElapsedTime() + delay) * 0.05;
    } else {
        // Chaos: Random tumbling
        groupRef.current.rotation.x = clock.getElapsedTime() + delay;
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.5 + delay;
    }
  });

  return (
    <group 
      ref={groupRef} 
      onClick={(e) => { 
        e.stopPropagation(); // Stop tree toggle
        onActivate(e); 
      }}
      // Cursor pointer to indicate interactivity
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <PhotoMesh textureUrl={textureUrl} />
    </group>
  );
};

const PhotoOrnaments: React.FC<PhotoOrnamentsProps> = ({ progress, onInteract }) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const photos = useMemo(() => {
    // We strictly use the length of our provided assets
    const count = PHOTO_PATHS.length;
    const items = [];

    for (let i = 0; i < count; i++) {
      // Logic to place BELOW animals
      // Animals are roughly height 5.0 to 9.5
      // Photos should be ~ 1.5 to 4.5
      
      const height = 2.0 + (i / (count - 1)) * 2.5; // Range 2.0 to 4.5
      const radiusAtHeight = 4.2 * (1 - height / 12);
      
      // Distribute around
      const theta = (i / count) * Math.PI * 2;
      const x = Math.cos(theta) * radiusAtHeight;
      const z = Math.sin(theta) * radiusAtHeight;
      
      // Push out slightly
      const vec = new THREE.Vector3(x, 0, z).normalize().multiplyScalar(0.7);

      items.push({
        id: i,
        // Match math.ts yOffset of -4 roughly
        targetPos: [x + vec.x, height - 4, z + vec.z] as [number, number, number],
        chaosPos: getRandomSpherePoint(14),
        delay: Math.random() * 10,
        url: PHOTO_PATHS[i].url,
      });
    }
    return items;
  }, []);

  const handleActivate = (id: number) => {
    if (activeId === id) {
      setActiveId(null); // Close
    } else {
      setActiveId(id); // Open
    }
  };

  return (
    <group>
      {photos.map((item) => (
        <PhotoGroup
          key={item.id}
          id={item.id}
          chaosPos={item.chaosPos}
          targetPos={item.targetPos}
          progress={progress}
          delay={item.delay}
          isActive={activeId === item.id}
          onActivate={() => handleActivate(item.id)}
          textureUrl={item.url}
        />
      ))}
    </group>
  );
};

export default PhotoOrnaments;
