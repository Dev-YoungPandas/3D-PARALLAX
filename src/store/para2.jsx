"use client";

import React, { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Text, OrbitControls, useScroll, ScrollControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Model component with scroll-based rotation and parallax
function ModelLoader({ url, position, rotationSpeed = 1, scale = 1, scrollOffset = 0 }) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef();
  const scroll = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useFrame((state) => {
    if (meshRef.current && scroll) {
      const currentScrollProgress = scroll.offset;
      setScrollProgress(currentScrollProgress);
      
      // Rotation based on scroll progress (not automatic)
      const rotationAmount = currentScrollProgress * Math.PI * 2 * rotationSpeed;
      meshRef.current.rotation.x = rotationAmount * 0.5;
      meshRef.current.rotation.y = rotationAmount * 0.8;
      meshRef.current.rotation.z = rotationAmount * 0.3;
      
      // Parallax movement - models start from bottom and move completely off-screen at top
      const parallaxOffset = currentScrollProgress * 30; // Increased to 20 units for complete movement
      meshRef.current.position.y = position[1] - 6 + parallaxOffset; // Start 4 units below, move 16 units above original
      
      // Horizontal movement remains same
      meshRef.current.position.x = position[0];
      
      // Scale effect during scroll (slight scale change)
      const scaleMultiplier = 1 + currentScrollProgress * 0.2;
      meshRef.current.scale.setScalar(scale * scaleMultiplier);
      
      // Keep models always visible (no opacity change)
      if (meshRef.current.material) {
        meshRef.current.material.opacity = 1;
        meshRef.current.material.transparent = false;
      }
    }
  });

  const scene = useMemo(() => {
    const clonedScene = gltf.scene.clone();
    // Ensure materials are visible
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.transparent = false;
          child.material.opacity = 1; // Always visible
        }
      }
    });
    return clonedScene;
  }, [gltf.scene]);

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      position={[position[0], position[1] - 4, position[2]]} // Start slightly below original position
      scale={[scale, scale, scale]} // Normal size
    />
  );
}



// Scene with models
function Scene() {
  const models = useMemo(() => [
    {
      url: "/medias/S-a.glb",
      position: [-4, 3, 0],
      rotationSpeed: 1.2,
      scale: 2,
      scrollOffset: 0,
      color: "#E8B4F0",
    },
    {
      url: "/medias/S-b.glb", 
      position: [2, -4.9, 0],
      rotationSpeed: 0.8,
      scale: 2.3,
      scrollOffset: 0.1,
      color: "#FF6B6B",
    },
    {
      url: "/medias/S-c.glb",
      position: [4.5, 0, 0],
      rotationSpeed: 1.5,
      scale: 3,
      scrollOffset: 0.2,
      color: "#4A90E2",
    },
    {
      url: "/medias/S-d.glb",
      position: [8, 3, 0],
      rotationSpeed: 0.9,
      scale: 2,
      scrollOffset: 0.3,
      color: "#F0F0F0",
    },
    {
      url: "/medias/S-e.glb",
      position: [8.6, -1, 0],
      rotationSpeed: 1.1,
      scale: 2.2,
      scrollOffset: 0.4,
      color: "#FFD93D",
    },
    {
      url: "/medias/S-f.glb",
      position: [-2, 0, 0],
      rotationSpeed: 1.3,
      scale: 2.3,
      scrollOffset: 0.5,
      color: "#E8B4F0",
    },
    {
      url: "/medias/S-g.glb",
      position: [-7, 0, 0],
      rotationSpeed: 0.7,
      scale: 2.3,
      scrollOffset: 0.6,
      color: "#FF6B6B",
    },
    {
      url: "/medias/S-h_001.glb",
      position: [-9, 4, 0],
      rotationSpeed: 1.4,
      scale: 2.0,
      scrollOffset: 0.7,
      color: "#E8B4F0",
    },
    {
      url: "/medias/S-h_002.glb",
      position: [3, 3.8, 0],
      rotationSpeed: 1.0,
      scale: 2,
      scrollOffset: 0.8,
      color: "#C8860D",
    },
    {
      url: "/medias/S-h.glb",
      position: [-6, -4, 0],
      rotationSpeed: 1.6,
      scale: 2.3,
      scrollOffset: 0.9,
      color: "#F0F0D0",
    },
    {
      url: "/medias/S-h_003.glb",
      position: [9, -5, 0],
      rotationSpeed: 0.6,
      scale: 2,
      scrollOffset: 1.0,
      color: "#4A90E2",
    }
  ], []);

  return (
    <>
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={1.0} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
      
      {/* 3D Models */}
      {models.map((model, index) => (
        <Suspense key={index} >
          <ModelLoader
            url={model.url}
            position={model.position}
            rotationSpeed={model.rotationSpeed}
            scale={model.scale}
            scrollOffset={model.scrollOffset}
            color={model.color}
          />
        </Suspense>
      ))}
    </>
  );
}

// Main component with enhanced scroll tracking
export default function ParallaxScroll3D() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = currentScrollY / maxScroll;
      
      setScrollY(currentScrollY);
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative">
     

      {/* 3D Models Section with enhanced parallax */}
      <div className="h-[180vh] w-full relative overflow-hidden bg-white">
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center text-black">
            <h1 className="text-5xl font-bold mb-4 opacity-90">
              3D Parallax Scrolling Effect
            </h1>
            <h1 className="text-3xl mb-2 opacity-80">
              Using Three.js & React Three Fiber
            </h1>
            <h1 className="text-2xl mb-2 opacity-70">
              Models rotate and move with scroll
            </h1>
            <h1 className="text-xl opacity-60">
              Inspired by awwwards websites
            </h1>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [0, 0, 15], fov: 75 }}
          className="w-full h-full absolute inset-0"
          style={{ width: '100vw', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <ScrollControls pages={3} damping={0.2}>
            <Scene />
          </ScrollControls>
        </Canvas>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <div className="text-white text-center">
            <div className="w-6 h-10 border-2 border-white rounded-full mb-2 mx-auto">
              <div 
                className="w-1 h-3 bg-white rounded-full mx-auto mt-2 transition-transform duration-300"
                style={{ transform: `translateY(${scrollProgress * 20}px)` }}
              />
            </div>
            <p className="text-sm">Keep Scrolling</p>
          </div>
        </div>
      </div>

     
    </div>
  );
}