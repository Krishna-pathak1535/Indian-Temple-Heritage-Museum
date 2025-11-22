import React, { useRef, useMemo } from 'react';
import { OrbitControls, useGLTF, Environment, Sky, Cloud } from '@react-three/drei';
import { Temple, TemplePosition, Weapon, WeaponPosition, Fossil, FossilPosition } from '../types';
import { TempleDisplay } from './TempleDisplay';
import * as THREE from 'three';

type CategoryType = 'temples' | 'weapons' | 'fossils' | null;

interface TirupatiSceneProps {
  temples: Temple[];
  weapons?: Weapon[];
  fossils?: Fossil[];
  onItemClick?: (item: Temple | Weapon | Fossil, category: CategoryType) => void;
  selectedCategory?: CategoryType;
}

export const TirupatiScene: React.FC<TirupatiSceneProps> = ({ 
  temples, 
  weapons = [], 
  fossils = [],
  onItemClick,
  selectedCategory 
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Position temples in organized circular rings
  const templePositions = useMemo((): TemplePosition[] => {
    const positions: TemplePosition[] = [];
    const totalTemples = temples.length;
    
    if (totalTemples === 0) return positions;
    
    // Optimize: Only create positions for the selected category
    if (selectedCategory !== 'temples') return positions;
    
    // Organize temples in 3 concentric circles for better spacing
    const ring1Count = Math.min(20, totalTemples); // Inner ring
    const ring2Count = Math.min(25, Math.max(0, totalTemples - 20)); // Middle ring
    const ring3Count = Math.max(0, totalTemples - 45); // Outer ring
    
    const ring1Radius = 12;
    const ring2Radius = 16;
    const ring3Radius = 20;
    
    const height = 1.5; // Consistent height for all displays

    temples.forEach((temple, index) => {
      let radius: number;
      let countInRing: number;
      let indexInRing: number;

      // Determine which ring this temple belongs to
      if (index < ring1Count) {
        radius = ring1Radius;
        countInRing = ring1Count;
        indexInRing = index;
      } else if (index < ring1Count + ring2Count) {
        radius = ring2Radius;
        countInRing = ring2Count;
        indexInRing = index - ring1Count;
      } else {
        radius = ring3Radius;
        countInRing = ring3Count;
        indexInRing = index - ring1Count - ring2Count;
      }

      // Calculate even spacing around the circle
      const angle = (indexInRing / countInRing) * Math.PI * 2;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions.push({
        temple,
        position: [x, height, z],
      });
    });

    return positions;
  }, [temples, selectedCategory]);

  // Position weapons in organized rings
  const weaponPositions = useMemo((): WeaponPosition[] => {
    const positions: WeaponPosition[] = [];
    const totalWeapons = weapons.length;
    
    if (totalWeapons === 0) return positions;
    
    // Optimize: Only create positions for the selected category
    if (selectedCategory !== 'weapons') return positions;
    
    const radius = 14; // Single ring for weapons
    const height = 1.5;

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
  }, [weapons, selectedCategory]);

  // Position fossils in organized rings
  const fossilPositions = useMemo((): FossilPosition[] => {
    const positions: FossilPosition[] = [];
    const totalFossils = fossils.length;
    
    if (totalFossils === 0) return positions;
    
    // Optimize: Only create positions for the selected category
    if (selectedCategory !== 'fossils') return positions;
    
    const radius = 14; // Single ring for fossils
    const height = 1.5;

    fossils.forEach((fossil, index) => {
      const angle = (index / totalFossils) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions.push({
        fossil,
        position: [x, height, z],
      });
    });

    return positions;
  }, [fossils, selectedCategory]);

  return (
    <>
      {/* Beautiful Realistic Sky with Enhanced Clouds */}
      <Sky
        distance={450000}
        sunPosition={[100, 30, 100]}
        inclination={0.5}
        azimuth={0.1}
        mieCoefficient={0.003}
        mieDirectionalG={0.95}
        rayleigh={1.5}
        turbidity={4}
      />

      {/* Multiple Layers of Realistic Clouds */}
      {/* Upper layer - distant clouds */}
      <Cloud
        opacity={0.5}
        speed={0.08}
        bounds={[15, 3, 15]}
        position={[20, 15, -10]}
        color="#FFFFFF"
      />
      <Cloud
        opacity={0.45}
        speed={0.06}
        bounds={[18, 3, 18]}
        position={[-25, 16, -15]}
        color="#F8F8FF"
      />
      <Cloud
        opacity={0.4}
        speed={0.07}
        bounds={[20, 3, 20]}
        position={[15, 17, 20]}
        color="#FFFAFA"
      />
      
      {/* Middle layer - medium distance clouds */}
      <Cloud
        opacity={0.6}
        speed={0.1}
        bounds={[12, 2.5, 12]}
        position={[10, 12, -8]}
        color="#FFFFFF"
      />
      <Cloud
        opacity={0.55}
        speed={0.12}
        bounds={[14, 2.5, 14]}
        position={[-18, 13, 5]}
        color="#F0F8FF"
      />
      <Cloud
        opacity={0.5}
        speed={0.11}
        bounds={[16, 2.5, 16]}
        position={[5, 13, 18]}
        color="#FFFAFA"
      />
      <Cloud
        opacity={0.58}
        speed={0.09}
        bounds={[13, 2.5, 13]}
        position={[-12, 14, -12]}
        color="#FFFFFF"
      />
      
      {/* Lower layer - closer, more visible clouds */}
      <Cloud
        opacity={0.7}
        speed={0.15}
        bounds={[10, 2, 10]}
        position={[8, 9, -5]}
        color="#FFFFFF"
      />
      <Cloud
        opacity={0.65}
        speed={0.14}
        bounds={[11, 2, 11]}
        position={[-15, 10, 8]}
        color="#F8F8FF"
      />
      <Cloud
        opacity={0.68}
        speed={0.13}
        bounds={[9, 2, 9]}
        position={[12, 10, 10]}
        color="#FFFAFA"
      />
      <Cloud
        opacity={0.6}
        speed={0.16}
        bounds={[10, 2, 10]}
        position={[-10, 11, -8]}
        color="#FFFFFF"
      />

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[15, 20, 10]} 
        intensity={1.2} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight 
        color="#87CEEB" 
        groundColor="#8B7355" 
        intensity={0.5} 
      />
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#FFF8DC" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.8}
        penumbra={1}
        intensity={0.4}
        castShadow
      />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* Camera Controls - adjusted for larger scene with mountain backdrop */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={5}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2}
      />

      {/* 3D Temple Model */}
      <TempleModel />

      {/* Temple Stone Floor with Tile Pattern */}
      <TempleFloor />

      {/* Temple Displays */}
      <group ref={groupRef}>
        {templePositions.map(({ temple, position }) => (
          <TempleDisplay
            key={`temple-${temple.id}`}
            item={temple}
            position={position}
            category="temples"
            onItemClick={onItemClick}
          />
        ))}
        
        {weaponPositions.map(({ weapon, position }) => (
          <TempleDisplay
            key={`weapon-${weapon.id}`}
            item={weapon}
            position={position}
            category="weapons"
            onItemClick={onItemClick}
          />
        ))}
        
        {fossilPositions.map(({ fossil, position }) => (
          <TempleDisplay
            key={`fossil-${fossil.id}`}
            item={fossil}
            position={position}
            category="fossils"
            onItemClick={onItemClick}
          />
        ))}
      </group>
    </>
  );
};

// Temple Model Component
const TempleModel: React.FC = () => {
  const modelRef = useRef<THREE.Group>(null);

  // Try to load the GLB model with error handling
  let modelScene: THREE.Group | null = null;
  
  try {
    const gltf = useGLTF('/models/south_indian_temple_modular_kit.glb');
    modelScene = gltf.scene as THREE.Group;
  } catch (error) {
    console.error('Error loading 3D temple model:', error);
    modelScene = null;
  }

  // If model loaded successfully, render it
  if (modelScene) {
    return (
      <primitive
        ref={modelRef}
        object={modelScene.clone()}
        scale={0.5}
        position={[0, 0, 0]}
      />
    );
  }

  // Fallback: Create a simple temple structure if model fails to load
  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      {/* Central Temple Structure */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[4, 4, 4]} />
        <meshStandardMaterial color="#D4A574" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[3, 2, 4]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>

      {/* Pillars */}
      {[[-2, 0, 2], [2, 0, 2], [-2, 0, -2], [2, 0, -2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 3]} />
          <meshStandardMaterial color="#A0826D" />
        </mesh>
      ))}
    </group>
  );
};

// Temple Stone Floor Component - Realistic Indian temple stone tiles
const TempleFloor: React.FC = () => {
  const tiles: JSX.Element[] = [];
  const tileSize = 2;
  const gridSize = 60; // 120x120 floor with 2x2 tiles = 60 tiles per side (larger for mountain backdrop)
  
  for (let x = -gridSize; x < gridSize; x++) {
    for (let z = -gridSize; z < gridSize; z++) {
      const posX = x * tileSize;
      const posZ = z * tileSize;
      
      // Create alternating pattern (checkerboard-like but subtle)
      const isAlternate = (x + z) % 2 === 0;
      
      // Vary colors slightly for natural stone appearance
      const baseColor = isAlternate ? '#B8A899' : '#A89888';
      const edgeColor = '#8B7D6B';
      
      tiles.push(
        <group key={`tile-${x}-${z}`} position={[posX, 0, posZ]}>
          {/* Main tile */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[tileSize - 0.05, tileSize - 0.05]} />
            <meshStandardMaterial 
              color={baseColor}
              roughness={0.85}
              metalness={0.1}
            />
          </mesh>
          
          {/* Tile borders/grout lines */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]} receiveShadow>
            <planeGeometry args={[tileSize, tileSize]} />
            <meshStandardMaterial 
              color={edgeColor}
              roughness={0.95}
            />
          </mesh>
        </group>
      );
    }
  }
  
  return <group>{tiles}</group>;
};

// Preload the temple model
useGLTF.preload('/models/south_indian_temple_modular_kit.glb');
