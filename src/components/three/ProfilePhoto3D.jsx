import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeStore } from '../../store/themeStore';

// Procedural placeholder (initials RH on gradient)
function PlaceholderPhoto({ accentColor }) {
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    // Gradient background
    const grad = ctx.createRadialGradient(128, 100, 10, 128, 128, 128);
    grad.addColorStop(0, '#1a2a4a');
    grad.addColorStop(1, '#071220');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 256);
    // Silhouette
    ctx.fillStyle = '#2a3f60';
    ctx.beginPath(); ctx.arc(128, 90, 50, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(128, 210, 72, 80, 0, 0, Math.PI * 2); ctx.fill();
    // Initials
    ctx.fillStyle = accentColor; ctx.font = 'bold 52px "Inter", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('RH', 128, 120);
    // Border ring
    ctx.strokeStyle = accentColor; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(128, 128, 120, 0, Math.PI * 2); ctx.stroke();
    return new THREE.CanvasTexture(canvas);
  }, [accentColor]);

  return (
    <mesh>
      <circleGeometry args={[1.0, 64]} />
      <meshBasicMaterial map={canvasTexture} transparent />
    </mesh>
  );
}

// Orbiting particle ring
function OrbitRing({ color, radius = 1.55, count = 60, speed = 0.5 }) {
  const ref = useRef();
  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 0.4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius * 0.3 + tilt;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.5;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, [count, radius]);

  useFrame(({ clock: c }) => {
    if (!ref.current) return;
    ref.current.rotation.y = c.getElapsedTime() * speed;
    ref.current.rotation.x = Math.sin(c.getElapsedTime() * 0.3) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// Pulsing glow ring 
function GlowRing({ color, isHovered }) {
  const ref = useRef();
  useFrame(({ clock: c }) => {
    if (!ref.current) return;
    const pulse = 0.85 + Math.sin(c.getElapsedTime() * 2.5) * 0.15;
    ref.current.material.opacity = pulse * (isHovered ? 0.95 : 0.55);
    ref.current.rotation.z = c.getElapsedTime() * (isHovered ? 0.8 : 0.3);
  });
  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <ringGeometry args={[1.12, 1.22, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.55} side={THREE.DoubleSide} />
    </mesh>
  );
}

// 3D photo plane with tilt
function PhotoPlane({ accentColor }) {
  const meshRef = useRef();
  const { gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = gl.domElement;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    canvas.addEventListener('mousemove', onMove);
    return () => canvas.removeEventListener('mousemove', onMove);
  }, [gl]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += (mouse.current.x * 0.25 - meshRef.current.rotation.y) * 0.08;
    meshRef.current.rotation.x += (-mouse.current.y * 0.25 - meshRef.current.rotation.x) * 0.08;
  });

  return (
    <group ref={meshRef}>
      <PlaceholderPhoto accentColor={accentColor} />
    </group>
  );
}

// The full 3D scene inside the small canvas
function PhotoScene({ accentColor, isHovered }) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[2, 2, 2]} intensity={1.2} color={accentColor} />
      <pointLight position={[-2, -1, 1]} intensity={0.3} color="#ffffff" />

      <GlowRing color={accentColor} isHovered={isHovered} />
      <PhotoPlane accentColor={accentColor} />
      <OrbitRing color={accentColor} radius={1.55} count={50} speed={0.4} />
      <OrbitRing color={accentColor} radius={1.75} count={35} speed={-0.25} />
    </>
  );
}

export function ProfilePhoto3D({ size = 200 }) {
  const { theme } = useThemeStore();
  const [isHovered, setIsHovered] = useState(false);
  const accentColor = theme === 'ocean' ? '#0EA5E9' : '#C77DFF';

  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden', position: 'relative', cursor: 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Romen Halder 3D profile photo"
    >
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 45 }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PhotoScene accentColor={accentColor} isHovered={isHovered} />
        </Suspense>
      </Canvas>
    </div>
  );
}
