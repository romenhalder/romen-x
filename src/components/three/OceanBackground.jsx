import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Premium Day Mode Background
 * Soft gradient sky + gentle floating particles + mesh grid lines
 * Inspired by Apple/Linear/Stripe hero backgrounds
 */

// ----- Gradient Sky Dome -----
function GradientSky() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColorTop: { value: new THREE.Color('#E8F0FE') },
      uColorMid: { value: new THREE.Color('#F0F4FF') },
      uColorBottom: { value: new THREE.Color('#FAFBFF') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform vec3 uColorTop;
      uniform vec3 uColorMid;
      uniform vec3 uColorBottom;
      varying vec2 vUv;
      void main() {
        float t = pow(vUv.y, 0.6);
        vec3 col;
        if(t < 0.5) {
          col = mix(uColorBottom, uColorMid, t * 2.0);
        } else {
          col = mix(uColorMid, uColorTop, (t - 0.5) * 2.0);
        }
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <primitive object={mat} />
    </mesh>
  );
}

// ----- Soft Floating Particles -----
function FloatingParticles() {
  const ref = useRef();
  const count = 300;

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
      sz[i] = 0.8 + Math.random() * 1.5;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, sizes: sz, phases: ph };
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        float drift = sin(uTime * 0.3 + aPhase) * 0.5;
        vec3 pos = position;
        pos.y += drift;
        pos.x += sin(uTime * 0.15 + aPhase * 2.0) * 0.3;
        float flicker = 0.4 + 0.6 * sin(uTime * 0.8 + aPhase);
        vAlpha = flicker * 0.35;
        gl_PointSize = aSize * flicker;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if(d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        gl_FragColor = vec4(0.4, 0.55, 0.9, alpha);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => { mat.uniforms.uTime.value = c.getElapsedTime(); });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <primitive object={mat} />
    </points>
  );
}

// ----- Subtle Grid Mesh (Linear-style) -----
function GridMesh() {
  const ref = useRef();
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vec2 grid = fract(vUv * 20.0);
        float lineX = smoothstep(0.02, 0.0, abs(grid.x - 0.5) - 0.48);
        float lineY = smoothstep(0.02, 0.0, abs(grid.y - 0.5) - 0.48);
        float line = max(lineX, lineY);
        
        // Fade at edges
        float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) *
                         smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        
        // Subtle wave pulse
        float pulse = 0.03 + 0.02 * sin(uTime * 0.5 + vUv.x * 6.0 + vUv.y * 4.0);
        
        float alpha = line * edgeFade * pulse;
        gl_FragColor = vec4(0.37, 0.51, 0.85, alpha);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => { mat.uniforms.uTime.value = c.getElapsedTime(); });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -3, -8]}>
      <planeGeometry args={[50, 30, 1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}

// ----- Soft Light Orbs (bokeh-like) -----
function LightOrbs() {
  const orbData = useMemo(() => [
    { pos: [-6, 3, -12], color: '#2563EB', scale: 3.0, speed: 0.2 },
    { pos: [8, 2, -15], color: '#0EA5E9', scale: 4.0, speed: 0.15 },
    { pos: [-3, -1, -10], color: '#6366F1', scale: 2.5, speed: 0.25 },
    { pos: [5, 4, -18], color: '#818CF8', scale: 3.5, speed: 0.12 },
  ], []);

  return (
    <>
      {orbData.map((orb, i) => (
        <OrbMesh key={i} {...orb} index={i} />
      ))}
    </>
  );
}

function OrbMesh({ pos, color, scale, speed, index }) {
  const ref = useRef();
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float d = distance(vUv, vec2(0.5));
        float alpha = smoothstep(0.5, 0.0, d) * 0.07;
        float pulse = 1.0 + 0.15 * sin(uTime * 0.8);
        gl_FragColor = vec4(uColor, alpha * pulse);
      }
    `,
  }), [color]);

  useFrame(({ clock: c }) => {
    const t = c.getElapsedTime();
    mat.uniforms.uTime.value = t;
    if (ref.current) {
      ref.current.position.y = pos[1] + Math.sin(t * speed + index) * 0.5;
      ref.current.position.x = pos[0] + Math.cos(t * speed * 0.7 + index) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={pos}>
      <planeGeometry args={[scale, scale]} />
      <primitive object={mat} />
    </mesh>
  );
}

// ----- Camera Parallax -----
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -0.8;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.03;
    target.current.y += (mouse.current.y - target.current.y) * 0.03;
    camera.position.x = target.current.x;
    camera.position.y = 1.5 + target.current.y;
  });

  return null;
}

// ----- Main Scene -----
export function OceanBackground() {
  return (
    <>
      <GradientSky />
      <GridMesh />
      <FloatingParticles />
      <LightOrbs />
      <CameraController />

      {/* Soft ambient lighting — no harsh shadows */}
      <ambientLight color="#F0F4FF" intensity={1.6} />
      <directionalLight position={[5, 8, 2]} color="#E8F0FE" intensity={0.4} />
    </>
  );
}

export default OceanBackground;
