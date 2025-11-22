import React, { useRef, useMemo } from 'react';
import { OrbitControls, useGLTF, Sky } from '@react-three/drei';
import { Fossil, FossilPosition } from '../types';
import { TempleDisplay } from './TempleDisplay';
import * as THREE from 'three';

interface FossilsSceneProps {
  fossils: Fossil[];
  onItemClick?: (item: Fossil, category: 'fossils') => void;
}

export const FossilsScene: React.FC<FossilsSceneProps> = ({ 
  fossils, 
  onItemClick
}) => {
  const groupRef = useRef<THREE.Group>(null);

  const fossilPositions = useMemo((): FossilPosition[] => {
    const positions: FossilPosition[] = [];
    const totalFossils = fossils.length;
    
    if (totalFossils === 0) return positions;
    
    // Place fossils in a circle on the museum display (paleontology theme)
    const radius = 12;  // Wider spread across the display
    const height = 3.5; // Height to be on top of the display platform

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
  }, [fossils]);

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[80, 40, 80]}
        inclination={0.4}
        azimuth={0.15}
        turbidity={2}
      />

      <ambientLight intensity={1.2} color="#e8e8e8" />
      <directionalLight 
        position={[20, 30, 15]} 
        intensity={1.5} 
        color="#f5f5f0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight 
        color="#d4a574" 
        groundColor="#8b7355" 
        intensity={0.7} 
      />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={10}
        maxDistance={85}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 3, 0]}
      />

      <MuseumDisplay />

      <MuseumFloor />

      <group ref={groupRef}>
        {fossilPositions.map(({ fossil, position }) => (
          <TempleDisplay
            key={`fossil-${fossil.id}`}
            item={fossil}
            position={position}
            category="fossils"
            onItemClick={onItemClick as any}
          />
        ))}
      </group>
    </>
  );
};

const MuseumDisplay: React.FC = () => {
  console.log('🏛️ MuseumDisplay component rendering...');
  
  // Try to load the museum.glb model
  let modelScene: THREE.Group | null = null;
  
  try {
    console.log('📦 Attempting to load museum.glb model...');
    const gltf = useGLTF('/models/museum.glb');
    modelScene = gltf.scene as THREE.Group;
    
    const bbox = new THREE.Box3().setFromObject(modelScene);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    
    console.log('✅ Museum model loaded successfully!', {
      modelScene,
      children: modelScene.children.length,
      size: `${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`,
    });
    
    // Optimize the model
    let meshCount = 0;
    modelScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshCount++;
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material.needsUpdate = false;
          // Museum-like material
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.metalness = 0.1;
                mat.roughness = 0.8;
              }
            });
          } else if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.metalness = 0.1;
            child.material.roughness = 0.8;
          }
        }
      }
    });
    
    console.log(`🔢 Museum model contains ${meshCount} meshes`);
  } catch (error) {
    console.error('❌ Error loading museum model:', error);
    modelScene = null;
  }
  
  // If model loaded successfully, use it
  if (modelScene) {
    const scale = 0.15;
    return (
      <group>
        <primitive 
          object={modelScene.clone()} 
          scale={scale} 
          position={[0, 0, 0]} 
        />
      </group>
    );
  }
  
  // Fallback: Show simple procedural museum display if model fails to load
  console.log('🏛️ Rendering fallback procedural museum display');
  return (
    <group position={[0, 0, 0]}>
      {/* Central display platform - inspired by paleontology museums */}
      <mesh position={[0, 2, 0]} receiveShadow>
        <boxGeometry args={[30, 1, 30]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Center column */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.5, 4, 8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>

      {/* Display cases around center */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={`case-${i}`} position={[x, 0, z]}>
            {/* Display case pedestal */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[3, 1.5, 3]} />
              <meshStandardMaterial color="#a0826d" roughness={0.75} />
            </mesh>
            {/* Display case top */}
            <mesh position={[0, 3, 0]} receiveShadow>
              <boxGeometry args={[3.2, 0.2, 3.2]} />
              <meshStandardMaterial color="#8b7355" roughness={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* Museum walls - create an enclosed feel */}
      {/* Back wall */}
      <mesh position={[0, 6, -20]} receiveShadow>
        <boxGeometry args={[45, 12, 0.5]} />
        <meshStandardMaterial color="#c19a6b" roughness={0.8} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-22.5, 6, 0]} receiveShadow>
        <boxGeometry args={[0.5, 12, 40]} />
        <meshStandardMaterial color="#c19a6b" roughness={0.8} />
      </mesh>

      <mesh position={[22.5, 6, 0]} receiveShadow>
        <boxGeometry args={[0.5, 12, 40]} />
        <meshStandardMaterial color="#c19a6b" roughness={0.8} />
      </mesh>

      {/* Lighting fixtures for museum atmosphere */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={`light-${i}`} position={[x, 10, z]}>
            {/* Light fixture */}
            <mesh>
              <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
              <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.6} />
            </mesh>
            {/* Point light */}
            <pointLight position={[0, 0.25, 0]} intensity={0.8} color="#fffaf0" distance={30} />
          </group>
        );
      })}
    </group>
  );
};

const MuseumFloor: React.FC = () => {
  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const tileSize = 64;
      for (let x = 0; x < size; x += tileSize) {
        for (let y = 0; y < size; y += tileSize) {
          // Checkerboard pattern for museum floor
          const isChecked = ((x / tileSize) + (y / tileSize)) % 2 === 0;
          let baseColor = isChecked ? '#a0826d' : '#8b7355';
          
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, tileSize, tileSize);
          
          // Add subtle grout lines
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    return texture;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[320, 320]} />
      <meshStandardMaterial 
        map={floorTexture}
        roughness={0.8}
        metalness={0.05}
      />
    </mesh>
  );
};

useGLTF.preload('/models/museum.glb');
