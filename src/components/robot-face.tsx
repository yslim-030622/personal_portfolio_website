"use client";

import {Canvas, useFrame} from "@react-three/fiber";
import {useEffect, useRef, useMemo} from "react";
import * as THREE from "three";
import {Environment, Float} from "@react-three/drei";

/* ─── Mouse state shared across frames ─────────────────────────────── */
const mouseNorm = {x: 0, y: 0};

/* ─── High-Quality Minimalist Polar Bear ───────────────────────────── */
function PolishedBear() {
  const headGroupRef = useRef<THREE.Group>(null);
  const lEyeRef = useRef<THREE.Mesh>(null);
  const rEyeRef = useRef<THREE.Mesh>(null);

  // Smooth interpolation state
  const lerped = useRef({rx: 0, ry: 0});
  // Blink state
  const blinkState = useRef({timer: 2, blinking: false, t: 0});

  // Materials: High quality, slightly glossy/soft look
  const fur = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#ffffff", 
      roughness: 0.6, 
      metalness: 0.05,
    }),
    []
  );
  
  const snoutFur = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#f4f4f4", 
      roughness: 0.7, 
      metalness: 0.05
    }),
    []
  );

  const eyeMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#0f0f0f", 
      roughness: 0.2, 
      metalness: 0.8
    }),
    []
  );

  const noseMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#181818", 
      roughness: 0.4, 
      metalness: 0.4
    }),
    []
  );

  const blushMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#ff8da1", 
      roughness: 1, 
      transparent: true, 
      opacity: 0.35
    }),
    []
  );

  const innerEarMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#ffd6de", 
      roughness: 0.8
    }),
    []
  );

  useFrame((_, delta) => {
    const t = 0.1; // damping
    const L = lerped.current;

    // Head rotation target from mouse
    const tRx = mouseNorm.y * -0.35; 
    const tRy = mouseNorm.x * 0.45;  
    L.rx += (tRx - L.rx) * t;
    L.ry += (tRy - L.ry) * t;

    if (headGroupRef.current) {
      headGroupRef.current.rotation.x = L.rx;
      headGroupRef.current.rotation.y = L.ry;
      // Adorable head tilt based on horizontal look
      headGroupRef.current.rotation.z = -L.ry * 0.15; 
    }

    // Blinking logic
    const B = blinkState.current;
    B.timer -= delta;
    if (B.timer <= 0 && !B.blinking) {
      B.blinking = true;
      B.t = 0;
      B.timer = 2.0 + Math.random() * 4.0;
    }
    if (B.blinking) {
      B.t += delta * 15; 
      // Blink curve
      const blinkScale = B.t < Math.PI ? Math.max(0.05, 1 - Math.sin(B.t)) : 1;
      
      if (lEyeRef.current) lEyeRef.current.scale.y = blinkScale;
      if (rEyeRef.current) rEyeRef.current.scale.y = blinkScale;
      
      if (B.t >= Math.PI) {
        B.blinking = false;
        if (lEyeRef.current) lEyeRef.current.scale.y = 1;
        if (rEyeRef.current) rEyeRef.current.scale.y = 1;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={headGroupRef}>
        {/* Head */}
        <mesh material={fur} scale={[1.1, 0.95, 1]}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>

        {/* Left Ear */}
        <group position={[-0.7, 0.6, 0]} rotation={[0, 0, 0.2]}>
          <mesh material={fur}>
            <sphereGeometry args={[0.35, 32, 32]} />
          </mesh>
          <mesh material={innerEarMat} position={[0, 0, 0.15]} scale={[0.6, 0.6, 0.4]}>
            <sphereGeometry args={[0.35, 32, 32]} />
          </mesh>
        </group>
        
        {/* Right Ear */}
        <group position={[0.7, 0.6, 0]} rotation={[0, 0, -0.2]}>
          <mesh material={fur}>
            <sphereGeometry args={[0.35, 32, 32]} />
          </mesh>
          <mesh material={innerEarMat} position={[0, 0, 0.15]} scale={[0.6, 0.6, 0.4]}>
            <sphereGeometry args={[0.35, 32, 32]} />
          </mesh>
        </group>

        {/* Snout */}
        <mesh material={snoutFur} position={[0, -0.15, 0.85]} scale={[0.6, 0.45, 0.4]}>
          <sphereGeometry args={[1, 64, 64]} />
        </mesh>

        {/* Nose */}
        <mesh material={noseMat} position={[0, -0.02, 1.22]} scale={[0.18, 0.12, 0.1]}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>

        {/* Eyes */}
        <mesh ref={lEyeRef} material={eyeMat} position={[-0.35, 0.18, 0.92]} scale={[0.08, 0.08, 0.04]}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        <mesh ref={rEyeRef} material={eyeMat} position={[0.35, 0.18, 0.92]} scale={[0.08, 0.08, 0.04]}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>

        {/* Blush */}
        <mesh material={blushMat} position={[-0.5, -0.05, 0.82]} scale={[0.15, 0.08, 0.05]} rotation={[0, 0, 0.1]}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
        <mesh material={blushMat} position={[0.5, -0.05, 0.82]} scale={[0.15, 0.08, 0.05]} rotation={[0, 0, -0.1]}>
          <sphereGeometry args={[1, 32, 32]} />
        </mesh>
      </group>
    </Float>
  );
}

/* ─── Mouse listener (global, mounted once) ────────────────────────── */
function MouseTracker() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNorm.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, {passive: true});
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return null;
}

/* ─── Public component ──────────────────────────────────────────────── */
export function RobotFace() {
  return (
    // REMOVED `overflow: hidden` and `borderRadius: "50%"` to stop clipping the ears!
    // Increased size slightly so it fits perfectly without being squished.
    <div style={{width: 60, height: 60, flexShrink: 0, position: "relative"}}>
      <Canvas
        camera={{position: [0, 0, 4.5], fov: 40}}
        gl={{antialias: true, alpha: true}}
        style={{background: "transparent"}}
      >
        <MouseTracker />

        {/* Environment map for high-quality PBR lighting (makes it look professional!) */}
        <Environment preset="city" />
        
        {/* Fill lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-4, 2, 1]} intensity={0.5} color="#e0eeff" />

        <PolishedBear />
      </Canvas>
    </div>
  );
}
