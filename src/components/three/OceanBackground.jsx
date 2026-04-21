import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ----- Ocean Wave Surface -----
function OceanSurface() {
  const meshRef = useRef();
  const materialRef = useRef();
  const clock = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(30, 30, 80, 80);
    return g;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorShallow: { value: new THREE.Color('#38BDF8') },
        uColorDeep: { value: new THREE.Color('#0369A1') },
        uColorFoam: { value: new THREE.Color('#DBEAFE') },
      },
      vertexShader: `
        uniform float uTime;
        varying float vElevation;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          float freq = 0.5;
          float amp = 0.3;
          pos.z += sin(pos.x * freq + uTime * 0.8) * amp;
          pos.z += sin(pos.y * freq * 0.7 + uTime * 0.65) * amp * 0.8;
          pos.z += sin((pos.x + pos.y) * freq * 0.4 + uTime * 1.1) * amp * 0.5;
          vElevation = pos.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorShallow;
        uniform vec3 uColorDeep;
        uniform vec3 uColorFoam;
        varying float vElevation;
        varying vec2 vUv;
        
        void main() {
          float t = (vElevation + 0.35) / 0.7;
          t = clamp(t, 0.0, 1.0);
          vec3 color = mix(uColorDeep, uColorShallow, t);
          // foam highlights at wave peaks
          float foam = smoothstep(0.25, 0.35, vElevation);
          color = mix(color, uColorFoam, foam * 0.6);
          // specular
          float spec = pow(max(t - 0.5, 0.0) * 2.0, 3.0) * 0.6;
          color += vec3(spec);
          gl_FragColor = vec4(color, 0.92);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame(({ clock: c }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = c.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.5, -2]}>
      <primitive object={geometry} />
      <primitive object={material} ref={materialRef} />
    </mesh>
  );
}

// ----- Foam Particles -----
function FoamParticles() {
  const ref = useRef();
  const count = 1500;

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = -0.8 + Math.random() * 0.6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
      spd[i] = 0.002 + Math.random() * 0.005;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += speeds[i] * 0.6;
      if (pos[i * 3 + 0] > 14) pos[i * 3 + 0] = -14;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#DBEAFE" size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ----- Floating Bubbles -----
function Bubbles() {
  const ref = useRef();
  const count = 120;

  const { positions, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = -2 + Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, []);

  useFrame(({ clock: c }) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array;
    const t = c.getElapsedTime();
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += 0.003;
      pos[i * 3 + 0] += Math.sin(t + phases[i]) * 0.001;
      if (pos[i * 3 + 1] > 2) {
        pos[i * 3 + 1] = -2;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 20;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#BFDBFE" size={0.05} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// ----- Sky Background Mesh -----
function Sky() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColorTop: { value: new THREE.Color('#87CEEB') },
      uColorBottom: { value: new THREE.Color('#F0F8FF') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform vec3 uColorTop;
      uniform vec3 uColorBottom;
      varying vec2 vUv;
      void main() {
        vec3 col = mix(uColorBottom, uColorTop, pow(vUv.y, 0.5));
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[40, 32, 32]} />
      <primitive object={mat} />
    </mesh>
  );
}

// ----- Camera Bob -----
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 3;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -1.5;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock: c }) => {
    target.current.x += (mouse.current.x - target.current.x) * 0.04;
    target.current.y += (mouse.current.y - target.current.y) * 0.04;
    camera.position.x = target.current.x;
    camera.position.y = 1.5 + target.current.y + Math.sin(c.getElapsedTime() * 0.5) * 0.08;
  });

  return null;
}

// ----- Main Scene -----
export function OceanBackground() {
  return (
    <>
      <Sky />
      <OceanSurface />
      <FoamParticles />
      <Bubbles />
      <CameraController />

      {/* Sun */}
      <pointLight position={[8, 6, -8]} color="#FFF5CC" intensity={3} distance={60} />
      <pointLight position={[8, 6, -8]} color="#FFFDE4" intensity={1} distance={40} />

      {/* Ambient */}
      <ambientLight color="#87CEEB" intensity={1.2} />
      <directionalLight position={[5, 8, 2]} color="#FFFFFF" intensity={0.8} />

      {/* Shallow water depth fog */}
      <fog attach="fog" color="#C7E8FB" near={18} far={35} />
    </>
  );
}

export default OceanBackground;
