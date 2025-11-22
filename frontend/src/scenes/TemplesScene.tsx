import React, { useRef, useMemo } from 'react';
import { OrbitControls, useGLTF, Sky, Cloud } from '@react-three/drei';
import { Temple, TemplePosition } from '../types';
import { TempleDisplay } from './TempleDisplay';
import * as THREE from 'three';

interface TemplesSceneProps {
  temples: Temple[];
  onItemClick?: (item: Temple, category: 'temples') => void;
}

export const TemplesScene: React.FC<TemplesSceneProps> = ({ 
  temples, 
  onItemClick
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Position temples in organized circular rings - HIGHER in the air
  const templePositions = useMemo((): TemplePosition[] => {
    const positions: TemplePosition[] = [];
    const totalTemples = temples.length;
    
    if (totalTemples === 0) return positions;
    
    // Organize temples in 3 concentric circles for better spacing
    const ring1Count = Math.min(20, totalTemples); // Inner ring
    const ring2Count = Math.min(25, Math.max(0, totalTemples - 20)); // Middle ring
    const ring3Count = Math.max(0, totalTemples - 45); // Outer ring
    
    const ring1Radius = 18;
    const ring2Radius = 24;
    const ring3Radius = 30;
    
    const height = 4.5; // HIGHER - above temple structures

    temples.forEach((temple, index) => {
      let radius: number;
      let countInRing: number;
      let indexInRing: number;

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

      const angle = (indexInRing / countInRing) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      positions.push({
        temple,
        position: [x, height, z],
      });
    });

    return positions;
  }, [temples]);

  return (
    <>
      {/* Beautiful Sunny Sky - Temple Theme */}
      <Sky
        distance={450000}
        sunPosition={[100, 50, 100]}
        inclination={0.3}
        azimuth={0.1}
        mieCoefficient={0.003}
        mieDirectionalG={0.95}
        rayleigh={1.5}
        turbidity={2}
      />

      {/* Optimized Clouds - Reduced for performance */}
      <Cloud opacity={0.5} speed={0.08} bounds={[15, 3, 15]} position={[20, 18, -10]} color="#FFFFFF" />
      <Cloud opacity={0.4} speed={0.09} bounds={[18, 3, 18]} position={[-25, 20, -15]} color="#F8F8FF" />

      {/* Optimized Lighting - Reduced shadows for performance */}
      <ambientLight intensity={0.9} color="#FFF8E7" />
      <directionalLight 
        position={[20, 30, 15]} 
        intensity={1.5} 
        castShadow
        color="#FFD700"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight 
        color="#FFE4B5" 
        groundColor="#D4A574" 
        intensity={0.7} 
      />

      {/* Removed Environment preset for better performance */}

      {/* Camera Controls - Adjusted for larger temple scene */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minDistance={8}
        maxDistance={80}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 2, 0]}
      />

      {/* Temple Model - ENLARGED and GROUNDED */}
      <TempleModel />

      {/* Temple Stone Floor - Larger area */}
      <TempleFloor />

      {/* Temple Displays */}
      <group ref={groupRef}>
        {templePositions.map(({ temple, position }) => (
          <TempleDisplay
            key={`temple-${temple.id}`}
            item={temple}
            position={position}
            category="temples"
            onItemClick={onItemClick as any}
          />
        ))}
      </group>
    </>
  );
};

// Temple Model Component - ENLARGED and PERFECTLY GROUNDED with performance optimization
const TempleModel: React.FC = () => {
  const modelRef = useRef<THREE.Group>(null);

  let modelScene: THREE.Group | null = null;
  
  try {
    const gltf = useGLTF('/models/south_indian_temple_modular_kit.glb');
    modelScene = gltf.scene as THREE.Group;
    
    // Optimize model materials and geometry
    if (modelScene) {
      modelScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          
          // Enable frustum culling
          mesh.frustumCulled = true;
          
          // Optimize material
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            if (material.isMeshStandardMaterial) {
              // Reduce material quality for performance
              material.roughness = Math.max(material.roughness, 0.5);
              material.metalness = Math.min(material.metalness, 0.3);
            }
          }
          
          // Optimize geometry
          if (mesh.geometry) {
            mesh.geometry.computeBoundingSphere();
            mesh.geometry.computeBoundingBox();
          }
          
          // Disable shadows for better performance
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      });
    }
  } catch (error) {
    console.error('Error loading temple model:', error);
    modelScene = null;
  }

  if (modelScene) {
    return (
      <primitive
        ref={modelRef}
        object={modelScene.clone()}
        scale={2.5} // ENLARGED - 5x bigger
        position={[0, 0, 0]} // GROUNDED - Y=0 touches floor
      />
    );
  }

  // Fallback temple structure - simplified
  return (
    <group ref={modelRef} position={[0, 0, 0]}>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[8, 5, 8]} />
        <meshStandardMaterial color="#D4A574" roughness={0.8} />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#8B6914" roughness={0.8} />
      </mesh>
      {[[-4, 0, 4], [4, 0, 4], [-4, 0, -4], [4, 0, -4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.5, 0.5, 5]} />
          <meshStandardMaterial color="#A0826D" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

// Temple Stone Floor - Optimized single plane with texture
const TempleFloor: React.FC = () => {
  const floorTexture = useMemo(() => {
    // Create a simple procedural texture using canvas
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create checkerboard pattern
      const tileSize = 32;
      for (let x = 0; x < size; x += tileSize) {
        for (let y = 0; y < size; y += tileSize) {
          const isAlternate = ((x / tileSize) + (y / tileSize)) % 2 === 0;
          ctx.fillStyle = isAlternate ? '#C9A362' : '#B89348';
          ctx.fillRect(x, y, tileSize, tileSize);
          
          // Add border
          ctx.strokeStyle = '#8B7355';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
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
        roughness={0.8}
        metalness={0.15}
      />
    </mesh>
  );
};

useGLTF.preload('/models/south_indian_temple_modular_kit.glb');
