import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Temple, Weapon, Fossil } from '../types';
import * as THREE from 'three';
import { contentAPI } from '../services/api';

type CategoryType = 'temples' | 'weapons' | 'fossils';

interface TempleDisplayProps {
  item: Temple | Weapon | Fossil;
  position: [number, number, number];
  category: CategoryType;
  onItemClick?: (item: Temple | Weapon | Fossil, category: CategoryType) => void;
}

// Texture cache to prevent re-loading same textures
const textureCache = new Map<string, THREE.Texture>();

const TempleDisplayComponent: React.FC<TempleDisplayProps> = ({ item, position, category, onItemClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Memoize image URL to prevent recalculation
  const imageUrl = useMemo(() => {
    let url = '';
    if ('static_image_url' in item) {
      url = item.static_image_url;
    } else if ('image_url' in item) {
      url = item.image_url;
    }
    return url ? contentAPI.getImageURL(category, url) : '';
  }, [item, category]);

  // Load texture with caching
  const imageTexture = useMemo(() => {
    if (!imageUrl) return null;
    
    // Check cache first
    if (textureCache.has(imageUrl)) {
      return textureCache.get(imageUrl)!;
    }

    try {
      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        imageUrl,
        (loadedTexture) => {
          loadedTexture.minFilter = THREE.LinearFilter;
          loadedTexture.magFilter = THREE.LinearFilter;
          loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
          textureCache.set(imageUrl, loadedTexture);
        },
        undefined,
        (error) => {
          console.error(`❌ Error loading texture for ${item.name}:`, error);
        }
      );
      return texture;
    } catch (error) {
      console.error(`❌ Error in loadTexture for ${item.name}:`, error);
      return null;
    }
  }, [imageUrl, item.name]);

  // Optimized animation - reduced calculations
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + item.id * 0.1) * 0.05;
      
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    if (onItemClick) {
      onItemClick(item, category);
    }
  }, [onItemClick, item, category]);

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);

  // Memoize display color
  const displayColor = useMemo(() => {
    switch (category) {
      case 'temples':
        return hovered ? '#ffd700' : '#c9a362';
      case 'weapons':
        return hovered ? '#ffffff' : '#d0d0d0';
      case 'animals':
        return hovered ? '#51cf66' : '#37a24a';
      default:
        return hovered ? '#ffd700' : '#c9a362';
    }
  }, [category, hovered]);

  // Memoize subtitle
  const subtitle = useMemo(() => {
    if (category === 'temples' && 'dynasty' in item) {
      return item.dynasty;
    } else if (category === 'weapons' && 'type' in item) {
      return item.type;
    } else if (category === 'animals' && 'role' in item) {
      return item.role.split(',')[0];
    }
    return '';
  }, [category, item]);

  // Memoize card size
  const cardSize = useMemo((): [number, number] => {
    switch (category) {
      case 'temples':
        return [1.5, 2.0];
      case 'weapons':
        return [2.5, 3.0];
      case 'animals':
        return [2.5, 3.0];
      default:
        return [1.5, 2.0];
    }
  }, [category]);

  return (
    <group position={position}>
      {/* Optimized card rendering */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow={false}
        receiveShadow={false}
      >
        <planeGeometry args={cardSize} />
        {imageTexture ? (
          <meshBasicMaterial
            map={imageTexture}
            transparent={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        ) : (
          <meshStandardMaterial
            color={displayColor}
            metalness={0.4}
            roughness={0.4}
            emissive={hovered ? '#ffaa00' : '#000000'}
            emissiveIntensity={hovered ? 0.5 : 0}
            side={THREE.DoubleSide}
          />
        )}
      </mesh>

      {/* Item Name Label */}
      <Text
        position={[0, -(cardSize[1] / 2) - 0.15, 0.06]}
        fontSize={category === 'temples' ? 0.1 : 0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={cardSize[0] - 0.2}
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {item.name}
      </Text>

      {/* Subtitle Label */}
      <Text
        position={[0, (cardSize[1] / 2) + 0.15, 0.06]}
        fontSize={category === 'temples' ? 0.08 : 0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={cardSize[0] - 0.2}
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {subtitle}
      </Text>
    </group>
  );
};

// Memoize component to prevent unnecessary re-renders
export const TempleDisplay = React.memo(TempleDisplayComponent, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.category === nextProps.category &&
    prevProps.position[0] === nextProps.position[0] &&
    prevProps.position[1] === nextProps.position[1] &&
    prevProps.position[2] === nextProps.position[2]
  );
});
