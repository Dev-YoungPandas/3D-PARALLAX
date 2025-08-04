"use client";

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, useScroll, ScrollControls, useGLTF, Html, useProgress } from '@react-three/drei';

// ==================== LOADER COMPONENT ====================
function Loader() {
  const { progress, loaded, total } = useProgress();
  
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-white bg-opacity-90 rounded-xl shadow-lg backdrop-blur-sm">
        {/* 3D Spinning Loader */}
        <div className="relative w-24 h-24 mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          
          {/* Middle spinning ring */}
          <div 
            className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full"
            style={{ 
              animation: 'spin 1s linear infinite'
            }}
          ></div>
          
          {/* Inner spinning ring */}
          <div 
            className="absolute inset-3 border-3 border-transparent border-t-purple-500 border-l-purple-400 rounded-full"
            style={{ 
              animation: 'spin 1.5s linear infinite reverse'
            }}
          ></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={{ animation: 'pulse 2s infinite' }}
            ></div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-80 mb-4">
          <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
            <span>Loading 3D Models...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                style={{ animation: 'shimmer 2s infinite' }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Loading Stats */}
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800 mb-1">
            {progress < 100 ? 'Loading Models...' : 'Almost Ready!'}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            {loaded} of {total} assets loaded
          </p>
          
          {/* Loading dots animation */}
          <div className="flex justify-center space-x-1">
            <div 
              className="w-2 h-2 bg-blue-500 rounded-full"
              style={{ animation: 'bounce 1.4s infinite' }}
            ></div>
            <div 
              className="w-2 h-2 bg-purple-500 rounded-full"
              style={{ animation: 'bounce 1.4s infinite 0.2s' }}
            ></div>
            <div 
              className="w-2 h-2 bg-pink-500 rounded-full"
              style={{ animation: 'bounce 1.4s infinite 0.4s' }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </Html>
  );
}

// ==================== OPTIMIZED GLTF MODEL COMPONENT ====================
function GLTFModel({ url, position, rotationSpeed = 1, scale = 1 }) {
  const meshRef = useRef();
  const scroll = useScroll();
  
  // Load GLTF model with optimization
  const { scene, error } = useGLTF(url);

  // Clone scene only once for performance
  const clonedScene = useMemo(() => {
    if (scene) {
      const cloned = scene.clone();
      cloned.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = true;
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
        }
      });
      return cloned;
    }
    return null;
  }, [scene]);

  useFrame((state) => {
    if (meshRef.current && scroll && clonedScene) {
      const currentScrollProgress = scroll.offset;
      
      // Rotation based on scroll progress
      const rotationAmount = currentScrollProgress * Math.PI * 2 * rotationSpeed;
      meshRef.current.rotation.x = rotationAmount * 0.5;
      meshRef.current.rotation.y = rotationAmount * 0.8;
      meshRef.current.rotation.z = rotationAmount * 0.3;
      
      // Delayed parallax movement
      const delayedProgress = Math.max(0, (currentScrollProgress - 0.15) * 1.2);
      const parallaxOffset = delayedProgress * 25;
      meshRef.current.position.y = position[1] - 8 + parallaxOffset;
      meshRef.current.position.x = position[0];
      meshRef.current.position.z = position[2];
      
      // Scale effect during scroll
      const scaleMultiplier = 1 + delayedProgress * 0.2;
      meshRef.current.scale.setScalar(scale * scaleMultiplier);
      
      // Opacity effect - fade in as they start moving
      const targetOpacity = Math.min(1, delayedProgress * 3);
      meshRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = targetOpacity;
        }
      });
    }
  });

  // Error fallback
  if (error) {
    return (
      <mesh ref={meshRef} position={[position[0], position[1] - 8, position[2]]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ff0000" transparent />
      </mesh>
    );
  }

  if (!clonedScene) return null;

  return (
    <primitive 
      ref={meshRef} 
      object={clonedScene} 
      position={[position[0], position[1] - 8, position[2]]} 
      scale={[scale, scale, scale]} 
    />
  );
}

// ==================== SCROLLING TEXT COMPONENT ====================
function ScrollingText() {
  const textRef = useRef();
  const scroll = useScroll();

  useFrame(() => {
    if (textRef.current && scroll) {
      const currentScrollProgress = scroll.offset;
      
      const textParallaxSpeed = 0.6;
      const textParallaxOffset = currentScrollProgress * textParallaxSpeed * 24;
      
      textRef.current.position.y = -2 + textParallaxOffset;
      textRef.current.position.z = -1;
      
      const scaleEffect = 1 + currentScrollProgress * 0.1;
      textRef.current.scale.setScalar(scaleEffect);
    }
  });

  return (
    <group ref={textRef}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        textAlign="center"
      >
        3D Parallax Scrolling Effect
      </Text>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        textAlign="center"
      >
        Using Three.js & React Three Fiber
      </Text>
      <Text
        position={[0, 1, 0]}
        fontSize={0.4}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        textAlign="center"
      >
        Models rotate and move with scroll
      </Text>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.35}
        color="#999999"
        anchorX="center"
        anchorY="middle"
        maxWidth={20}
        textAlign="center"
      >
        Inspired by awwwards websites
      </Text>
    </group>
  );
}

// ==================== SCENE COMPONENT WITH LOADER ====================
function Scene() {
  const gltfModels = useMemo(() => [
    { url: "/medias/S-a.glb", position: [-2, 3, 0], rotationSpeed: 1.2, scale: 1.2 },
    { url: "/medias/S-b.glb", position: [1, -2.9, 0], rotationSpeed: 0.8, scale: 1.4 },
    { url: "/medias/S-c.glb", position: [2, 1, 0], rotationSpeed: 1.5, scale: 1.8 },
    { url: "/medias/S-d.glb", position: [5, 3, 0], rotationSpeed: 0.9, scale: 1.2 },
    { url: "/medias/S-e.glb", position: [6, 0, 0], rotationSpeed: 1.1, scale: 1.3 },
    { url: "/medias/S-f.glb", position: [-2, 0, 0], rotationSpeed: 1.3, scale: 1.4 },
    { url: "/medias/S-g.glb", position: [-5, 0, 0], rotationSpeed: 0.7, scale: 1.4 },
    { url: "/medias/S-h_001.glb", position: [-6, 4, 0], rotationSpeed: 1.4, scale: 1.2 },
    { url: "/medias/S-h_002.glb", position: [3, 3.8, 0], rotationSpeed: 1.0, scale: 1.2 },
    { url: "/medias/S-h.glb", position: [-4, -3, 0], rotationSpeed: 1.6, scale: 1.4 },
    { url: "/medias/S-h_003.glb", position: [5, -3, 0], rotationSpeed: 0.6, scale: 1.2 }
  ], []);

  return (
    <Suspense fallback={<Loader />}>
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={1.0} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
      
      {/* 3D Text with parallax effect */}
      <ScrollingText />
      
      {/* GLTF Models */}
      {gltfModels.map((model, index) => (
        <GLTFModel
          key={`gltf-${index}`}
          url={model.url}
          position={model.position}
          rotationSpeed={model.rotationSpeed}
          scale={model.scale}
        />
      ))}
    </Suspense>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ParallaxScroll3D() {
  return (
    <div className="relative">
      {/* 3D Models Section with enhanced parallax */}
      <div className="h-[300vh] w-full relative overflow-hidden bg-gradient-to-b from-blue-50 to-purple-50">
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          className="w-full h-full absolute inset-0"
          style={{ width: '100vw', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <ScrollControls pages={4} damping={0}>
            <Scene />
          </ScrollControls>
        </Canvas>
      </div>
    </div>
  );
}

// ==================== PRELOAD MODELS FOR FASTER LOADING ====================
// All model paths ko preload karte hain
const modelPaths = [
  "/medias/S-a.glb",
  "/medias/S-b.glb", 
  "/medias/S-c.glb",
  "/medias/S-d.glb",
  "/medias/S-e.glb",
  "/medias/S-f.glb",
  "/medias/S-g.glb",
  "/medias/S-h_001.glb",
  "/medias/S-h_002.glb",
  "/medias/S-h.glb",
  "/medias/S-h_003.glb"
];

// Preload all models for faster loading
modelPaths.forEach(path => {
  useGLTF.preload(path);
});