"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function SnowEffect() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // --- Scene Setup ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();
    
    // Move camera closer and adjust FOV for better visibility
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.z = 400; 

    // Create renderer with explicit alpha and clear color
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Fully transparent background
    mountNode.appendChild(renderer.domElement);

    // --- Snow Generation ---
    const particleCount = 800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // Explicitly define velocity type and array
    const velocities: { x: number; y: number; swing: number; offset: number }[] = [];

    // Reduce spread for more concentrated, visible snow
    const spread = 1500; 

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * spread;
      const y = (Math.random() - 0.5) * spread;
      // Keep particles in front of camera (z < 400)
      const z = (Math.random() - 1) * spread; // -1500 to 0

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities.push({
        y: Math.random() * 3 + 1, // Fall speed (1 to 4)
        x: (Math.random() - 0.5) * 1.5, // Gentle drift
        swing: Math.random() * 0.3, // Subtle swing
        offset: Math.random() * Math.PI * 2
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // Important: mark as dynamic for frequent updates
    (geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

    // Texture generation
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 5, // Larger base size
      sizeAttenuation: true, // Size decreases with distance
      map: texture,
      transparent: true,
      opacity: 1,
      vertexColors: false,
      color: 0xffffff,
      depthWrite: false, 
      blending: THREE.AdditiveBlending 
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Store the positions array reference outside the animation loop
    const positionsArray = geometry.attributes.position.array as Float32Array;

    // --- Animation Loop ---
    let frameCount = 0;
    let isRunning = true; // Flag to stop animation on cleanup
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      if (!isRunning) return; // Exit if component unmounted
      
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      frameCount++;
      if (frameCount === 60) {
        console.log('Snow animation running, time:', time, 'first particle Y:', positionsArray[1]);
        frameCount = 0;
      }

      // Update each particle
      for (let i = 0; i < particleCount; i++) {
        const iy = i * 3 + 1; // Y index
        const ix = i * 3;     // X index
        const iz = i * 3 + 2; // Z index

        // Update Y position (falling down)
        positionsArray[iy] = positionsArray[iy] - velocities[i].y;

        // Update X position (horizontal drift with sine wave)
        const swing = Math.sin(time + velocities[i].offset) * velocities[i].swing;
        positionsArray[ix] = positionsArray[ix] + velocities[i].x + swing;

        // Reset particle to top if it goes below the view
        if (positionsArray[iy] < -spread / 2) {
          positionsArray[iy] = spread / 2;
          positionsArray[iz] = (Math.random() - 1) * spread; // Randomize Z depth
        }
        
        // Wrap horizontal positions
        if (positionsArray[ix] < -spread / 2) positionsArray[ix] = spread / 2;
        if (positionsArray[ix] > spread / 2) positionsArray[ix] = -spread / 2;
      }

      // CRITICAL: Explicitly mark the entire buffer for update
      const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
      positionAttribute.updateRanges = [{ start: 0, count: particleCount * 3 }];

      positionAttribute.needsUpdate = true;
      
      // Force geometry update
      geometry.computeBoundingSphere();
      
      // Very subtle scene rotation for depth effect
      scene.rotation.y = Math.sin(time * 0.05) * 0.02;

      // Render the scene
      renderer.render(scene, camera);
    };

    // Start the animation loop
    console.log('Starting snow animation');
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      console.log('Cleaning up snow animation');
      isRunning = false; // Stop the animation loop
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountNode && renderer.domElement) {
        mountNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
