import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CRIMSON NOIR — Professional Dark Day Theme 3D Background
 * Dark void + floating red particles + abstract wireframe rings + subtle grid
 */

// =========================================================
// DARK VOID BACKGROUND — near-black with subtle gradient
// =========================================================
function DarkVoid() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        // Very dark charcoal gradient — bottom slightly lighter
        float t = vUv.y;
        vec3 bottom = vec3(0.075, 0.050, 0.065); // dark charcoal-red
        vec3 top    = vec3(0.030, 0.020, 0.030); // near-black
        vec3 col    = mix(bottom, top, pow(t, 0.7));

        // Subtle radial vignette glow at center-bottom
        float cx = vUv.x - 0.5;
        float cy = vUv.y - 0.08;
        float d  = sqrt(cx*cx + cy*cy*0.4);
        float glow = exp(-d * d * 4.5) * 0.12;
        col += vec3(0.55, 0.08, 0.08) * glow;

        // Breathing pulse
        float breathe = sin(uTime * 0.20) * 0.008;
        col += breathe;

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `,
    side: THREE.BackSide,
  }), []);

  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <mesh>
      <sphereGeometry args={[60, 32, 32]} />
      <primitive object={mat} />
    </mesh>
  );
}

// =========================================================
// CRIMSON PARTICLE FIELD — floating red glowing motes
// =========================================================
function CrimsonParticles() {
  const count = 300;
  const { positions, sizes, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    const ph  = new Float32Array(count);
    const sp  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Spread in a wide hemisphere in front of camera
      const r   = 3 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI * 0.7;
      pos[i * 3]     = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.cos(phi) * r * 0.5 - 3;
      pos[i * 3 + 2] = -2 - Math.random() * 18;
      sz[i] = 0.8 + Math.random() * 2.0;
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.4 + Math.random() * 0.8;
    }
    return { positions: pos, sizes: sz, phases: ph, speeds: sp };
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      uniform float uTime;
      varying float vAlpha;
      varying float vBright;
      void main() {
        vec3 pos = position;
        // Gentle drift
        pos.y += sin(uTime * aSpeed * 0.35 + aPhase) * 0.6;
        pos.x += sin(uTime * aSpeed * 0.22 + aPhase * 1.3) * 0.4;
        float flicker = 0.4 + 0.6 * abs(sin(uTime * aSpeed * 0.5 + aPhase));
        vAlpha  = flicker * 0.55;
        vBright = flicker;
        gl_PointSize = aSize * flicker;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying float vBright;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
        // Core: bright white-red, edge: deep red
        vec3 core = vec3(1.0, 0.60, 0.60);
        vec3 edge = vec3(0.55, 0.06, 0.06);
        vec3 col  = mix(edge, core, smoothstep(0.4, 0.0, d) * vBright);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize"    count={count} array={sizes}     itemSize={1} />
        <bufferAttribute attach="attributes-aPhase"   count={count} array={phases}    itemSize={1} />
        <bufferAttribute attach="attributes-aSpeed"   count={count} array={speeds}    itemSize={1} />
      </bufferGeometry>
      <primitive object={mat} />
    </points>
  );
}

// =========================================================
// WHITE STAR PARTICLES — subtle background stars
// =========================================================
function Stars() {
  const count = 200;
  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz  = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40 + 5;
      pos[i * 3 + 2] = -15 - Math.random() * 30;
      sz[i]  = 0.4 + Math.random() * 0.8;
    }
    return { positions: pos, sizes: sz };
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      void main() {
        gl_PointSize = aSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      void main() {
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * 0.35;
        gl_FragColor = vec4(1.0, 0.90, 0.90, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize"    count={count} array={sizes}     itemSize={1} />
      </bufferGeometry>
      <primitive object={mat} />
    </points>
  );
}

// =========================================================
// ABSTRACT WIREFRAME RINGS — floating geometric shapes
// =========================================================
function WireRing({ position, radius, tubeRadius, color, opacity, rotSpeed }) {
  const meshRef = useRef();
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity,
  }), [color, opacity]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x += rotSpeed[0];
    meshRef.current.rotation.y += rotSpeed[1];
    meshRef.current.rotation.z += rotSpeed[2];
    // Subtle float
    meshRef.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.3;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[radius, tubeRadius, 8, 48]} />
      <primitive object={mat} />
    </mesh>
  );
}

function WireRings() {
  return (
    <>
      <WireRing position={[-8, 2, -14]} radius={2.2} tubeRadius={0.04} color="#E84545" opacity={0.35} rotSpeed={[0.004, 0.003, 0.001]} />
      <WireRing position={[10, -1, -18]} radius={3.0} tubeRadius={0.03} color="#FF6B6B" opacity={0.20} rotSpeed={[-0.002, 0.005, 0.002]} />
      <WireRing position={[0, 4, -22]} radius={4.5} tubeRadius={0.025} color="#E84545" opacity={0.12} rotSpeed={[0.001, -0.003, 0.004]} />
      <WireRing position={[-14, -3, -20]} radius={2.8} tubeRadius={0.03} color="#FF9550" opacity={0.15} rotSpeed={[0.003, 0.002, -0.003]} />
    </>
  );
}

// =========================================================
// ABSTRACT GEOMETRIC LINES — thin triangular shapes
// =========================================================
function GeometricShapes() {
  const shapes = useMemo(() => {
    const items = [];
    const positions = [
      [-12, 3, -12], [11, 5, -15], [-5, -4, -10],
      [8, -2, -13], [0, 7, -16], [-9, -5, -17],
    ];
    for (let i = 0; i < positions.length; i++) {
      const geo = new THREE.BufferGeometry();
      const size = 0.8 + Math.random() * 1.4;
      // Triangle verts
      const verts = new Float32Array([
        0, size, 0,
        -size * 0.866, -size * 0.5, 0,
        size * 0.866, -size * 0.5, 0,
        0, size, 0,
      ]);
      geo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
      const mat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#E84545' : '#FF6B6B',
        transparent: true,
        opacity: 0.18 + Math.random() * 0.12,
      });
      items.push({ geo, mat, pos: positions[i], rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] });
    }
    return items;
  }, []);

  const refs = useRef(shapes.map(() => null));
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.z = t * (0.2 + i * 0.05) * (i % 2 === 0 ? 1 : -1);
      mesh.position.y = shapes[i].pos[1] + Math.sin(t * 0.3 + i) * 0.25;
    });
  });

  return (
    <>
      {shapes.map((s, i) => (
        <line key={i} ref={el => refs.current[i] = el} position={s.pos} rotation={s.rot}>
          <primitive object={s.geo} />
          <primitive object={s.mat} />
        </line>
      ))}
    </>
  );
}

// =========================================================
// SUBTLE GRID FLOOR — low-opacity red grid
// =========================================================
function GridFloor() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        // Grid lines
        float gx = abs(fract(vUv.x * 16.0) - 0.5);
        float gy = abs(fract(vUv.y * 16.0) - 0.5);
        float line = smoothstep(0.48, 0.45, min(gx, gy));
        // Fade from center, fade at edges
        float cx = 1.0 - abs(vUv.x - 0.5) * 2.0;
        float cy = 1.0 - abs(vUv.y - 0.5) * 2.0;
        float fade = cx * cy;
        float alpha = line * fade * 0.10;
        // Breathing
        alpha *= 0.7 + 0.3 * sin(uTime * 0.3);
        gl_FragColor = vec4(0.85, 0.12, 0.12, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <mesh position={[0, -4, -15]} rotation={[-0.3, 0, 0]} scale={[40, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}

// =========================================================
// RED GLOW LIGHT — atmospheric red bloom at bottom-center
// =========================================================
function RedGlow() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float d = distance(vUv, vec2(0.5, 0.5)) * 2.0;
        float glow = exp(-d * d * 1.8);
        float breathe = 0.6 + 0.4 * sin(uTime * 0.5);
        float alpha = glow * breathe * 0.18;
        gl_FragColor = vec4(0.90, 0.08, 0.08, alpha);
      }
    `,
  }), []);

  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.getElapsedTime(); });

  return (
    <mesh position={[0, -3, -8]} scale={[22, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}

// =========================================================
// CAMERA PARALLAX
// =========================================================
function CameraController() {
  const { camera } = useThree();
  const mouse  = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 1.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -0.8;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    target.current.x += (mouse.current.x - target.current.x) * 0.025;
    target.current.y += (mouse.current.y - target.current.y) * 0.025;
    camera.position.x = target.current.x;
    camera.position.y = 1.5 + target.current.y;
  });

  return null;
}

// =========================================================
// MAIN SCENE
// =========================================================
export function OceanBackground() {
  return (
    <>
      <DarkVoid />
      <RedGlow />
      <GridFloor />
      <WireRings />
      <GeometricShapes />
      <Stars />
      <CrimsonParticles />
      <CameraController />

      {/* Dark atmospheric lighting — subtle red tint */}
      <ambientLight color="#200808" intensity={3.0} />
      <pointLight position={[0, 2, -8]}  color="#E84545" intensity={0.6} distance={40} />
      <pointLight position={[-10, 5, -15]} color="#FF6B6B" intensity={0.3} distance={30} />
    </>
  );
}

export default OceanBackground;
