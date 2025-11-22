import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingOrb extends THREE.Object3D {
  userData: {
    speed: number;
    radius: number;
    angle: number;
  };
}

const FloatingOrbs: React.FC = () => {
  const orbsRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (!orbsRef.current) return;

    const animate = () => {
      if (orbsRef.current) {
        orbsRef.current.children.forEach((orb) => {
          const floatingOrb = orb as FloatingOrb;
          floatingOrb.userData.angle += floatingOrb.userData.speed;
          floatingOrb.position.x = Math.cos(floatingOrb.userData.angle) * floatingOrb.userData.radius;
          floatingOrb.position.z = Math.sin(floatingOrb.userData.angle) * floatingOrb.userData.radius;
        });
      }
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  const orbs = [
    { color: '#667eea', position: [5, 2, 0], radius: 8, speed: 0.005 },
    { color: '#764ba2', position: [-5, -2, 0], radius: 10, speed: 0.003 },
    { color: '#f093fb', position: [0, 3, 5], radius: 6, speed: 0.007 },
    { color: '#4facfe', position: [0, -3, -5], radius: 9, speed: 0.004 },
  ];

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, index) => (
        <Float
          key={index}
          speed={2}
          rotationIntensity={0.5}
          floatIntensity={1}
        >
          <mesh position={orb.position as [number, number, number]}>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
          <pointLight
            position={orb.position as [number, number, number]}
            color={orb.color}
            intensity={2}
            distance={15}
          />
        </Float>
      ))}
    </group>
  );
};

const GridFloor: React.FC = () => {
  return (
    <group position={[0, -5, 0]}>
      <gridHelper args={[50, 30, '#667eea', '#444444']} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#0a0a0a"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const TechRings: React.FC = () => {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[8 + i * 3, 0.1, 16, 100]} />
          <meshStandardMaterial
            color="#667eea"
            emissive="#667eea"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3 - i * 0.08}
          />
        </mesh>
      ))}
    </group>
  );
};

export const GameRoomScene: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 2, 12], fov: 60 }}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#ffffff" />

      {/* Background */}
      <Stars
        radius={100}
        depth={50}
        count={3000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Scene Elements */}
      <FloatingOrbs />
      <GridFloor />
      <TechRings />

      {/* Central Focus Point */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0, 3, -8]}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial
            color="#667eea"
            emissive="#667eea"
            emissiveIntensity={0.8}
            wireframe
          />
        </mesh>
      </Float>

      {/* Controls - disabled pointer events */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
};
