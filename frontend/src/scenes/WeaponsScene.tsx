import React, { useRef, useMemo } from 'react';
import { OrbitControls, useGLTF, Sky } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Weapon, WeaponPosition } from '../types';
import { TempleDisplay } from './TempleDisplay';
import * as THREE from 'three';

interface WeaponsSceneProps {
  weapons: Weapon[];
  onItemClick?: (item: Weapon, category: 'weapons') => void;
}

export const WeaponsScene: React.FC<WeaponsSceneProps> = ({ 
  weapons, 
  onItemClick
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Position weapons in circular formation - HIGHER in the air and WIDER spread
  const weaponPositions = useMemo((): WeaponPosition[] => {
    const positions: WeaponPosition[] = [];
    const totalWeapons = weapons.length;
    
    if (totalWeapons === 0) return positions;
    
    const radius = 25; // MUCH WIDER - spread across enlarged battlefield
    const height = 7.0; // HIGHER - to be visible above battlefield terrain

    weapons.forEach((weapon, index) => {
      const angle = (index / totalWeapons) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions.push({
        weapon,
        position: [x, height, z],
      });
    });

    return positions;
  }, [weapons]);

  return (
    <>
      {/* Dramatic Battlefield Sky - Orange Sunset */}
      <Sky
        distance={450000}
        sunPosition={[100, 10, -50]}
        inclination={0.1}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
        rayleigh={0.5}
        turbidity={8}
      />

      {/* Optimized Lighting - Reduced for performance */}
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight 
        position={[15, 25, 10]} 
        intensity={1.0} 
        castShadow
        color="#ffffff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight 
        color="#dddddd" 
        groundColor="#999999" 
        intensity={0.5} 
      />

      {/* Camera Controls - Adjusted for battlefield */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={10}
        maxDistance={85}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 2, 0]}
      />

      {/* Battlefield Model - ENLARGED and GROUNDED */}
      <BattlefieldModel />

      {/* Battlefield Ground - Rocky terrain */}
      <BattlefieldFloor />

      {/* Animated Water Body - Right side */}
      <AnimatedWater />

      {/* Weapon Displays */}
      <group ref={groupRef}>
        {weaponPositions.map(({ weapon, position }) => (
          <TempleDisplay
            key={`weapon-${weapon.id}`}
            item={weapon}
            position={position}
            category="weapons"
            onItemClick={onItemClick as any}
          />
        ))}
      </group>
    </>
  );
};

// Battlefield Model Component - Optimized
const BattlefieldModel: React.FC = () => {
  const modelRef = useRef<THREE.Group>(null);

  let modelScene: THREE.Group | null = null;
  
  try {
    const gltf = useGLTF('/models/battlefield.glb');
    modelScene = gltf.scene as THREE.Group;
    
    // Optimize model
    if (modelScene) {
      modelScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.frustumCulled = true;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });
    }
  } catch (error) {
    console.error('Error loading battlefield model:', error);
    modelScene = null;
  }

  if (modelScene) {
    return (
      <primitive
        ref={modelRef}
        object={modelScene.clone()}
        scale={12.0}
        position={[0, 0, 0]}
      />
    );
  }

  // Fallback - simplified
  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[10, 4, 10]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
    </group>
  );
};

// Battlefield Floor - Optimized single plane with texture
const BattlefieldFloor: React.FC = () => {
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const tileSize = 32;
      for (let x = 0; x < size; x += tileSize) {
        for (let y = 0; y < size; y += tileSize) {
          const variation = ((x / tileSize) * (y / tileSize)) % 3;
          let baseColor = '#8B7355';
          if (variation === 0) baseColor = '#A0826D';
          if (variation === 1) baseColor = '#6B5344';
          
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(40, 40);
    return texture;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[320, 320]} />
      <meshStandardMaterial 
        map={floorTexture}
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  );
};

// Animated Water Body Component - for the right side
const AnimatedWater: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  
  // Animate water with waves
  useFrame((state) => {
    if (waterRef.current) {
      const time = state.clock.elapsedTime;
      // Create wave effect by modifying position
      (waterRef.current.material as THREE.MeshStandardMaterial).normalScale.set(
        Math.sin(time * 0.5) * 0.3,
        Math.cos(time * 0.3) * 0.3
      );
    }
  });

  return (
    <group>
      {/* Main water plane - positioned on right side, EXTREMELY LARGE */}
      <mesh 
        ref={waterRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[90, 0.1, 0]} // Even further right to cover all empty space
        receiveShadow
      >
        <planeGeometry args={[200, 300]} /> {/* EXTREMELY LARGE - covers all empty area */}
        <meshStandardMaterial
          color="#66C2E0" // Light aqua/turquoise - realistic water color
          roughness={0.2}
          metalness={0.5}
          transparent
          opacity={0.75}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>
      
      {/* Water reflection effect - lighter layer */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[90, 0.08, 0]}
      >
        <planeGeometry args={[200, 300]} />
        <meshStandardMaterial
          color="#A8E6F0" // Very light blue - water highlights
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Deep water layer for depth */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[90, 0.05, 0]}
      >
        <planeGeometry args={[200, 300]} />
        <meshStandardMaterial
          color="#4FA8C5" // Medium blue-green - water depth
          roughness={0.3}
          metalness={0.4}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};

useGLTF.preload('/models/battlefield.glb');
