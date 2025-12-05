import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import AnimalOrnaments from './AnimalOrnaments';
import PhotoOrnaments from './PhotoOrnaments';
import { TreeState } from '../types';

interface SceneProps {
  treeState: TreeState;
  onToggle: () => void;
}

// Just the Classic Miffy Head - Refined for "Cuteness"
const MiffyHead = () => {
  const whiteMaterial = new THREE.MeshStandardMaterial({
    color: '#FFFFFF', 
    roughness: 1.0,   // Fully matte to look like a plush/cartoon
    metalness: 0.0,
    emissive: '#333333', // Slight emissive to stand out in dark
    emissiveIntensity: 0.1
  });

  const blackMaterial = new THREE.MeshBasicMaterial({
    color: '#000000',
  });

  return (
    // Scaled group
    <group scale={1.3}>
       {/* HEAD SHAPE: Slightly flattened sphere (Oblate spheroid) */}
       <mesh position={[0, 0, 0]} castShadow>
         <sphereGeometry args={[0.9, 64, 64]} />
         <primitive object={whiteMaterial} />
       </mesh>
       
       {/* EARS: Stretched Spheres instead of capsules for a softer, organic tapered look */}
       <group position={[0, 0.6, 0]}>
         {/* Left Ear */}
         <mesh position={[-0.45, 0.6, 0]} rotation={[0, 0, -0.05]} castShadow>
            {/* Scale sphere to look like a long bunny ear */}
            <sphereGeometry args={[0.26, 32, 32]} />
            <group scale={[1, 3.5, 1]}> {/* Stretch vertical */}
               <sphereGeometry args={[0.26, 32, 32]} />
            </group>
            {/* We use a scaled sphere directly on the mesh scale prop instead of geometry hacking */}
         </mesh>
         
         {/* Re-implementing ears with simple scaled meshes for cleaner geometry */}
         <mesh position={[-0.45, 0.6, 0]} rotation={[0, 0, -0.05]} scale={[1, 3.2, 1]} castShadow>
            <sphereGeometry args={[0.26, 32, 32]} />
            <primitive object={whiteMaterial} />
         </mesh>
         
         <mesh position={[0.45, 0.6, 0]} rotation={[0, 0, 0.05]} scale={[1, 3.2, 1]} castShadow>
            <sphereGeometry args={[0.26, 32, 32]} />
            <primitive object={whiteMaterial} />
         </mesh>
       </group>

       {/* FACE FEATURES */}
       <group position={[0, -0.1, 0.82]} rotation={[0.08, 0, 0]}>
         {/* Eyes: Wide set */}
         <mesh position={[-0.38, 0.1, 0]} rotation={[0, -0.1, 0]}>
           <sphereGeometry args={[0.08, 32, 32]} />
           <primitive object={blackMaterial} />
         </mesh>
         <mesh position={[0.38, 0.1, 0]} rotation={[0, 0.1, 0]}>
           <sphereGeometry args={[0.08, 32, 32]} />
           <primitive object={blackMaterial} />
         </mesh>
         
         {/* Mouth: The iconic X */}
         <group position={[0, -0.15, 0.05]} scale={0.7}>
           <mesh rotation={[0, 0, Math.PI / 4]}>
              <capsuleGeometry args={[0.05, 0.35]} />
              <primitive object={blackMaterial} />
           </mesh>
           <mesh rotation={[0, 0, -Math.PI / 4]}>
              <capsuleGeometry args={[0.05, 0.35]} />
              <primitive object={blackMaterial} />
           </mesh>
         </group>
       </group>
    </group>
  );
};

const TreeGroup: React.FC<SceneProps> = ({ treeState, onToggle }) => {
  // Initialize progress based on start state so it doesn't fly in if already formed
  const progressRef = useRef(treeState === TreeState.FORMED ? 1 : 0);
  const groupRef = useRef<THREE.Group>(null);
  const topperRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // State Machine interpolation
    const target = treeState === TreeState.FORMED ? 1 : 0;
    // Smooth damp towards target
    progressRef.current = THREE.MathUtils.damp(progressRef.current, target, 1.5, delta);

    // Rotate the whole tree slowly
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }

    // Animate Topper (Scale up when formed)
    if (topperRef.current) {
      const scale = THREE.MathUtils.lerp(0, 1, progressRef.current);
      topperRef.current.scale.setScalar(scale);
      // Gentle floating motion
      topperRef.current.position.y = 7.0 + Math.sin(state.clock.elapsedTime * 1) * 0.1;
      topperRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      {/* Invisible Hitbox for easier interaction */}
      <mesh onClick={(e) => { e.stopPropagation(); onToggle(); }} visible={false}>
        <cylinderGeometry args={[5, 5, 14]} />
        <meshBasicMaterial />
      </mesh>

      <Foliage count={12000} progress={progressRef} onInteract={onToggle} />
      <Ornaments progress={progressRef} onInteract={onToggle} />
      <AnimalOrnaments progress={progressRef} onInteract={onToggle} />
      <PhotoOrnaments progress={progressRef} onInteract={onToggle} />
      
      {/* 3D Miffy Head Topper */}
      <group ref={topperRef} position={[0, 7.8, 0]}>
        <MiffyHead />
        {/* Soft backlight for Miffy, local to the group */}
        <pointLight intensity={0.5} color="#FFF" distance={3} position={[0, 0, 2]} />
      </group>
    </group>
  );
};

const Scene: React.FC<SceneProps> = ({ treeState, onToggle }) => {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 4, 20], fov: 45 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      shadows
    >
      <color attach="background" args={['#020508']} />
      
      {/* Lighting - Magical Christmas Night */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
      <pointLight position={[-10, 5, 10]} intensity={0.5} color="#004225" />
      
      {/* Key light for Miffy and Tree Top */}
      <spotLight 
        position={[0, 25, 10]} 
        angle={0.4} 
        penumbra={1} 
        intensity={2.0} 
        castShadow 
        color="#FFFFFF"
      />

      <Environment preset="city" background={false} />

      {/* Starry Background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ambient Sparkles */}
      <Sparkles count={300} scale={[25, 25, 25]} size={3} speed={0.4} opacity={0.6} color="#D4AF37" />

      <Suspense fallback={null}>
        <TreeGroup treeState={treeState} onToggle={onToggle} />
      </Suspense>

      <ContactShadows opacity={0.4} scale={20} blur={2} far={4.5} />

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={10}
        maxDistance={35}
      />

      {/* Cinematic Post Processing */}
      <EffectComposer enableNormalPass={false}>
        <Bloom 
          luminanceThreshold={0.7} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.6}
        />
        <Vignette eskil={false} offset={0.1} darkness={0.4} />
      </EffectComposer>
    </Canvas>
  );
};

export default Scene;