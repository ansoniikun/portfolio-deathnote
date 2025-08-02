"use client";

import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { DeathNote } from "./DeathNote";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import MyBook from "./MyBook";
import AudioVisualizer from "./AudioVisualizer";

function CameraController({ onTransitionComplete }) {
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

    // Notify parent when transition is nearly complete
    if (easedProgress >= 0.95 && onTransitionComplete) {
      onTransitionComplete(true);
    } else if (easedProgress < 0.95 && onTransitionComplete) {
      onTransitionComplete(false);
    }
  });

  return null;
}

export default function Hero() {
  const [show3DBook, setShow3DBook] = useState(true);
  const [showFlipBook, setShowFlipBook] = useState(false);
  const [triggerBookOpen, setTriggerBookOpen] = useState(false);
  const [bookMethods, setBookMethods] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simplified page mapping - let MyBook handle the mode detection
  const pageMap = {
    about: 1, // About page
    experience: 2, // Experience page
    projects: 3, // Projects page
    socials: 4, // Thank you/Socials page
  };

  const pageMapOpen = {
    cover: 1, // About page
    about: 2, // Experience page
    experience: 3, // Projects page
    projects: 4, // Thank you/Socials page
  };

  const handleTransitionComplete = (isComplete) => {
    if (isComplete && show3DBook) {
      // Start transition: fade out 3D model, fade in flip book
      setTimeout(() => {
        setShow3DBook(false);
        setShowFlipBook(true);
        // Trigger book opening after a short delay
        setTimeout(() => {
          setTriggerBookOpen(true);
        }, 500);
      }, 200);
    } else if (!isComplete && !show3DBook) {
      // Reverse transition: show 3D model, hide flip book
      setShow3DBook(true);
      setShowFlipBook(false);
      setTriggerBookOpen(false);
    }
  };

  const handleNavClick = (e, section) => {
    e.preventDefault();

    // Close mobile menu if open
    setIsMobileMenuOpen(false);

    // If book is not currently shown, simulate scroll to open it first
    if (!showFlipBook) {
      // Simulate scroll to trigger the book opening
      const scrollTarget = window.innerHeight * 2; // Match the maxScroll in CameraController

      // Smooth scroll to trigger the transition
      window.scrollTo({
        top: scrollTarget,
        behavior: "smooth",
      });

      // Wait for scroll and book opening animation, then navigate to the specific page
      setTimeout(() => {
        if (bookMethods) {
          bookMethods.goToPage(pageMap[section]);
        }
      }, 2000); // Wait longer for scroll + transition + book opening
    } else {
      // Book is already shown, navigate directly
      if (bookMethods) {
        bookMethods.goToPage(pageMapOpen[section]);
      }
    }
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 font-deathnote text-white">
        <div className="text-xl">HLOMPHO</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-sm uppercase tracking-wider">
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "about")}
            className="hover:text-gray-400 transition cursor-pointer"
          >
            About Me
          </a>
          <a
            href="#experience"
            onClick={(e) => handleNavClick(e, "experience")}
            className="hover:text-gray-400 transition cursor-pointer"
          >
            Experience
          </a>
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, "projects")}
            className="hover:text-gray-400 transition cursor-pointer"
          >
            Projects
          </a>
          <a
            href="#socials"
            onClick={(e) => handleNavClick(e, "socials")}
            className="hover:text-gray-400 transition cursor-pointer"
          >
            Socials
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <div
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-transparent backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-black shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col pt-20 px-8 space-y-6 font-deathnote">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, "about")}
              className="text-white text-lg uppercase tracking-wider hover:text-gray-400 transition cursor-pointer border-b border-gray-700 pb-3"
            >
              About Me
            </a>
            <a
              href="#experience"
              onClick={(e) => handleNavClick(e, "experience")}
              className="text-white text-lg uppercase tracking-wider hover:text-gray-400 transition cursor-pointer border-b border-gray-700 pb-3"
            >
              Experience
            </a>
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, "projects")}
              className="text-white text-lg uppercase tracking-wider hover:text-gray-400 transition cursor-pointer border-b border-gray-700 pb-3"
            >
              Projects
            </a>
            <a
              href="#socials"
              onClick={(e) => handleNavClick(e, "socials")}
              className="text-white text-lg uppercase tracking-wider hover:text-gray-400 transition cursor-pointer border-b border-gray-700 pb-3"
            >
              Socials
            </a>
          </div>
        </div>
      </div>

      {/* Fixed 3D Canvas Background */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-10 transition-opacity duration-1000 ${
          show3DBook ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Canvas
          camera={{ position: [2, 10, 6], fov: 25 }}
          className="w-full h-full"
        >
          <Environment preset="studio" />
          <CameraController onTransitionComplete={handleTransitionComplete} />
          <DeathNote />
        </Canvas>
      </div>

      {/* Flip Book Container */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-20 flex items-center justify-center transition-opacity duration-1000 ${
          showFlipBook ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <MyBook triggerOpen={triggerBookOpen} onBookRefReady={setBookMethods} />
      </div>

      {/* Invisible Scrollable Content - just for scroll animation */}
      <div className="relative z-30 pointer-events-none">
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
        {/* <div className="h-screen"></div> */}
        {/* <div className="h-screen"></div> */}
      </div>

      <AudioVisualizer />
    </>
  );
}
