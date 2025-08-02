"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { DeathNote } from "./DeathNote";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

function CameraController() {
  const [scrollY, setScrollY] = useState(0);
  const cameraRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(({ camera }) => {
    // Normalize scroll progress (0 to 1) - adjust maxScroll as needed
    const maxScroll = window.innerHeight * 2; // Scroll distance for full animation
    const progress = Math.min(scrollY / maxScroll, 1);

    // Smooth the progress with easing function for more natural movement
    const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep

    // Interpolate camera position
    const startPos = new THREE.Vector3(2, 10, 6);
    const endPos = new THREE.Vector3(0, 10, 0);

    const currentPos = startPos.clone().lerp(endPos, easedProgress);
    camera.position.copy(currentPos);

    // Smooth rotation by interpolating lookAt target
    const startLookAt = new THREE.Vector3(0, 0, 0);
    const endLookAt = new THREE.Vector3(0, 0, 0);

    // Create quaternions for smooth rotation interpolation
    const tempCamera = new THREE.PerspectiveCamera();

    // Set up start orientation
    tempCamera.position.copy(startPos);
    tempCamera.lookAt(startLookAt);
    const startQuaternion = tempCamera.quaternion.clone();

    // Set up end orientation
    tempCamera.position.copy(endPos);
    tempCamera.lookAt(endLookAt);
    const endQuaternion = tempCamera.quaternion.clone();

    // Interpolate between quaternions for smooth rotation
    camera.quaternion.slerpQuaternions(
      startQuaternion,
      endQuaternion,
      easedProgress
    );
  });

  return null;
}

export default function Hero() {
  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 font-deathnote text-white">
        <div className="text-xl">HLOMPHO</div>
        <div className="space-x-8 text-sm uppercase tracking-wider">
          <Link href="#about" className="hover:text-gray-400 transition">
            About Me
          </Link>
          <Link href="#experience" className="hover:text-gray-400 transition">
            Experience
          </Link>
          <Link href="#projects" className="hover:text-gray-400 transition">
            Projects
          </Link>
          <Link href="#socials" className="hover:text-gray-400 transition">
            Socials
          </Link>
        </div>
      </nav>

      {/* Fixed 3D Canvas Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Canvas
          camera={{ position: [2, 10, 6], fov: 25 }}
          className="w-full h-full"
        >
          <Environment preset="studio" />
          <CameraController />
          <DeathNote />
        </Canvas>
      </div>

      {/* Invisible Scrollable Content - just for scroll animation */}
      <div className="relative z-10 pointer-events-none">
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </div>
    </>
  );
}
