// "use client";

// import React, { useRef, useMemo, Suspense } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Text, useScroll, ScrollControls, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// // Simple 3D object component (replace this with your GLTF loader later)
// function ScrollingObject({ position, rotationSpeed = 1, scale = 1, color = "#ff6b6b" }) {
//   const meshRef = useRef();
//   const scroll = useScroll();

//   useFrame((state) => {
//     if (meshRef.current && scroll) {
//       const currentScrollProgress = scroll.offset;
      
//       // Rotation based on scroll progress
//       const rotationAmount = currentScrollProgress * Math.PI * 2 * rotationSpeed;
//       meshRef.current.rotation.x = rotationAmount * 0.5;
//       meshRef.current.rotation.y = rotationAmount * 0.8;
//       meshRef.current.rotation.z = rotationAmount * 0.3;
      
//       // Parallax movement - objects start from bottom and move to top
//       const parallaxOffset = currentScrollProgress * 30;
//       meshRef.current.position.y = position[1] - 6 + parallaxOffset;
//       meshRef.current.position.x = position[0];
//       meshRef.current.position.z = position[2];
      
//       // Scale effect during scroll
//       const scaleMultiplier = 1 + currentScrollProgress * 0.2;
//       meshRef.current.scale.setScalar(scale * scaleMultiplier);
//     }
//   });

//   return (
//     <mesh ref={meshRef} position={[position[0], position[1] - 6, position[2]]}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color={color} />
//     </mesh>
//   );
// }

// // GLTF Model component using useGLTF hook
// function GLTFModel({ url, position, rotationSpeed = 1, scale = 1 }) {
//   const meshRef = useRef();
//   const scroll = useScroll();
  
//   // Load GLTF model using useGLTF hook
//   const { scene, error } = useGLTF(url);

//   useFrame((state) => {
//     if (meshRef.current && scroll) {
//       const currentScrollProgress = scroll.offset;
      
//       // Rotation based on scroll progress
//       const rotationAmount = currentScrollProgress * Math.PI * 2 * rotationSpeed;
//       meshRef.current.rotation.x = rotationAmount * 0.5;
//       meshRef.current.rotation.y = rotationAmount * 0.8;
//       meshRef.current.rotation.z = rotationAmount * 0.3;
      
//       // Parallax movement - models start from bottom and move to top
//       const parallaxOffset = currentScrollProgress * 30;
//       meshRef.current.position.y = position[1] - 6 + parallaxOffset;
//       meshRef.current.position.x = position[0];
//       meshRef.current.position.z = position[2];
      
//       // Scale effect during scroll
//       const scaleMultiplier = 1 + currentScrollProgress * 0.2;
//       meshRef.current.scale.setScalar(scale * scaleMultiplier);
//     }
//   });

//   // If there's an error loading the model, show a placeholder
//   if (error) {
//     return (
//       <mesh ref={meshRef} position={[position[0], position[1] - 6, position[2]]}>
//         <sphereGeometry args={[0.5, 16, 16]} />
//         <meshStandardMaterial color="#ff0000" />
//       </mesh>
//     );
//   }

//   return (
//     <primitive 
//       ref={meshRef} 
//       object={scene.clone()} 
//       position={[position[0], position[1] - 6, position[2]]} 
//       scale={[scale, scale, scale]} 
//     />
//   );
// }

// // Text component that follows the same scroll system as 3D models
// function ScrollingText() {
//   const textRef = useRef();
//   const scroll = useScroll();

//   useFrame(() => {
//     if (textRef.current && scroll) {
//       const currentScrollProgress = scroll.offset;
      
//       // Move text from bottom to top with same parallax as models
//       const textParallaxOffset = currentScrollProgress * 25;
//       textRef.current.position.y = -8 + textParallaxOffset;
//       textRef.current.position.z = 5; // Keep text in front of models
      
//       // Optional: Add slight scale effect
//       const scaleEffect = 1 + currentScrollProgress * 0.1;
//       textRef.current.scale.setScalar(scaleEffect);
//     }
//   });

//   return (
//     <group ref={textRef}>
//       <Text
//         position={[0, 2, 0]}
//         fontSize={0.5}
//         color="#000000"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={20}
//         textAlign="center"
//       >
//         3D Parallax Scrolling Effect
//       </Text>
//       <Text
//         position={[0, 1.5, 0]}
//         fontSize={0.5}
//         color="#333333"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={20}
//         textAlign="center"
//       >
//         Using Three.js & React Three Fiber
//       </Text>
//       <Text
//         position={[0, 1, 0]}
//         fontSize={0.4}
//         color="#666666"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={20}
//         textAlign="center"
//       >
//         Models rotate and move with scroll
//       </Text>
//       <Text
//         position={[0, 0.5, 0]}
//         fontSize={0.35}
//         color="#999999"
//         anchorX="center"
//         anchorY="middle"
//         maxWidth={20}
//         textAlign="center"
//       >
//         Inspired by awwwards websites
//       </Text>
//     </group>
//   );
// }

// // Scene with models and synchronized text
// function Scene() {
//   const objects = useMemo(() => [
//     { position: [-4, 3, 0], rotationSpeed: 1.2, scale: 1.2, color: "#E8B4F0" },
//     { position: [2, -4.9, 0], rotationSpeed: 0.8, scale: 1.4, color: "#FF6B6B" },
//     { position: [4.5, 0, 0], rotationSpeed: 1.5, scale: 1.8, color: "#4A90E2" },
//     { position: [8, 3, 0], rotationSpeed: 0.9, scale: 1.2, color: "#F0F0F0" },
//     { position: [8.6, -1, 0], rotationSpeed: 1.1, scale: 1.3, color: "#FFD93D" },
//     { position: [-2, 0, 0], rotationSpeed: 1.3, scale: 1.4, color: "#E8B4F0" },
//     { position: [-7, 0, 0], rotationSpeed: 0.7, scale: 1.4, color: "#FF6B6B" },
//     { position: [-9, 4, 0], rotationSpeed: 1.4, scale: 1.2, color: "#E8B4F0" },
//     { position: [3, 3.8, 0], rotationSpeed: 1.0, scale: 1.2, color: "#C8860D" },
//     { position: [-6, -4, 0], rotationSpeed: 1.6, scale: 1.4, color: "#F0F0D0" },
//     { position: [9, -5, 0], rotationSpeed: 0.6, scale: 1.2, color: "#4A90E2" }
//   ], []);

//   // Your GLTF models (uncomment and use when models are ready)
//   const gltfModels = useMemo(() => [
//     { url: "/medias/S-a.glb", position: [-2, 3, 0], rotationSpeed: 1.2, scale: 1.2 },
//     { url: "/medias/S-b.glb", position: [1, -3.9, 0], rotationSpeed: 0.8, scale: 1.4 },
//     { url: "/medias/S-c.glb", position: [3, 0, 0], rotationSpeed: 1.5, scale: 1.8 },
//     { url: "/medias/S-d.glb", position: [5, 3, 0], rotationSpeed: 0.9, scale: 1.2 },
//     { url: "/medias/S-e.glb", position: [6, -1, 0], rotationSpeed: 1.1, scale: 1.3 },
//     { url: "/medias/S-f.glb", position: [-2, 0, 0], rotationSpeed: 1.3, scale: 1.4 },
//     { url: "/medias/S-g.glb", position: [-5, 0, 0], rotationSpeed: 0.7, scale: 1.4 },
//     { url: "/medias/S-h_001.glb", position: [-6, 4, 0], rotationSpeed: 1.4, scale: 1.2 },
//     { url: "/medias/S-h_002.glb", position: [3, 3.8, 0], rotationSpeed: 1.0, scale: 1.2 },
//     { url: "/medias/S-h.glb", position: [-4, -4, 0], rotationSpeed: 1.6, scale: 1.4 },
//     { url: "/medias/S-h_003.glb", position: [5, -4, 0], rotationSpeed: 0.6, scale: 1.2 }
//     // Add more models here...
//   ], []);

//   return (
//     <>
//       {/* Enhanced lighting for better visibility */}
//       <ambientLight intensity={1.2} />
//       <directionalLight position={[10, 10, 5]} intensity={1.5} />
//       <directionalLight position={[-10, -10, -5]} intensity={1.0} />
//       <pointLight position={[0, 5, 5]} intensity={0.8} color="#ffffff" />
//       <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />
      
//       {/* 3D Text that follows same scroll system */}
//       <ScrollingText />
      
//       {/* Simple 3D Objects (comment out when GLTF models are working) */}
//       {/*
//       {objects.map((obj, index) => (
//         <ScrollingObject
//           key={index}
//           position={obj.position}
//           rotationSpeed={obj.rotationSpeed}
//           scale={obj.scale}
//           color={obj.color}
//         />
//       ))}
//       */}
      
//       {/* GLTF Models - Now using proper useGLTF hook */}
//       {gltfModels.map((model, index) => (
//         <Suspense key={`gltf-${index}`} fallback={
//           <mesh position={[model.position[0], model.position[1] - 6, model.position[2]]}>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color="#cccccc" />
//           </mesh>
//         }>
//           <GLTFModel
//             url={model.url}
//             position={model.position}
//             rotationSpeed={model.rotationSpeed}
//             scale={model.scale}
//           />
//         </Suspense>
//       ))}
      
//     </>
//   );
// }

// // Main component - only Three.js ScrollControls
// export default function ParallaxScroll3D() {
//   return (
//     <div className="relative">
//       {/* 3D Models Section with enhanced parallax */}
//       <div className="h-[300vh] w-full relative overflow-hidden bg-gradient-to-b from-blue-50 to-purple-50">
//         {/* 3D Canvas */}
//         <Canvas
//           camera={{ position: [0, 0, 15], fov: 75 }}
//           className="w-full h-full absolute inset-0"
//           style={{ width: '100vw', height: '100%' }}
//           gl={{ antialias: true, alpha: true }}
//         >
//           <ScrollControls pages={4} damping={0.1}>
//             <Scene />
//           </ScrollControls>
//         </Canvas>
//       </div>
//     </div>
//   );
// }vvvvvvvv