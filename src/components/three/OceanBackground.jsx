import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Himalayan Cloud Day Mode — Cinematic sunrise landscape
 * Layered mountain silhouettes + drifting clouds + mist + sun rays + dust particles
 */

// =========================================================
// SUNRISE SKY DOME — warm golden-to-blue gradient
// =========================================================
function HimalayanSky() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float t = pow(vUv.y, 0.55);
        // Bottom: warm golden horizon
        vec3 horizon = vec3(0.98, 0.88, 0.72);
        // Mid: soft pink blush
        vec3 blush = vec3(0.90, 0.82, 0.85);
        // Upper: pale blue sky
        vec3 sky = vec3(0.78, 0.88, 0.96);
        // Top: deeper blue
        vec3 zenith = vec3(0.62, 0.78, 0.94);
        
        vec3 col;
        if(t < 0.25) col = mix(horizon, blush, t * 4.0);
        else if(t < 0.55) col = mix(blush, sky, (t - 0.25) / 0.3);
        else col = mix(sky, zenith, (t - 0.55) / 0.45);
        
        // Subtle sun glow near horizon center
        float sunX = 0.5;
        float sunY = 0.18;
        float sunDist = distance(vec2(vUv.x, vUv.y * 0.5 + 0.25), vec2(sunX, sunY));
        float sunGlow = exp(-sunDist * sunDist * 12.0) * 0.35;
        col += vec3(1.0, 0.92, 0.7) * sunGlow;
        
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide,
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[60, 32, 32]} />
      <primitive object={mat} />
    </mesh>
  );
}

// =========================================================
// MOUNTAIN SILHOUETTES — 3 layered ranges with depth
// =========================================================
function MountainRange({ zPos, yBase, height, color, opacity, scale }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    vertexShader: `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec2 vUv;
      
      // Simple hash for mountain profile
      float hash(float n) { return fract(sin(n) * 43758.5453); }
      float noise1D(float x) {
        float i = floor(x);
        float f = fract(x);
        f = f * f * (3.0 - 2.0 * f);
        return mix(hash(i), hash(i + 1.0), f);
      }
      
      void main() {
        // Build jagged mountain profile
        float x = vUv.x;
        float peak = 0.0;
        peak += noise1D(x * 3.0) * 0.45;
        peak += noise1D(x * 7.0) * 0.25;
        peak += noise1D(x * 15.0) * 0.12;
        peak += noise1D(x * 30.0) * 0.06;
        
        // Mountain shape: solid below the peak line
        float mountainY = peak;
        float pixelY = vUv.y;
        
        if(pixelY > mountainY) discard;
        
        // Atmospheric fading at bottom
        float bottomFade = smoothstep(0.0, 0.08, pixelY);
        // Snow caps — brighten peaks
        float snowLine = mountainY - 0.06;
        float snow = smoothstep(snowLine, mountainY, pixelY) * 0.25;
        vec3 col = uColor + vec3(snow);
        
        gl_FragColor = vec4(col, uOpacity * bottomFade);
      }
    `,
  }), [color, opacity]);

  return (
    <mesh position={[0, yBase, zPos]} scale={[scale, height, 1]}>
      <planeGeometry args={[80, 1, 1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}

function Mountains() {
  return (
    <>
      {/* Far range — faint, pale blue-gray */}
      <MountainRange zPos={-35} yBase={0.5} height={8} color="#9AAEC4" opacity={0.4} scale={1.2} />
      {/* Mid range — medium depth */}
      <MountainRange zPos={-25} yBase={-0.5} height={7} color="#6B8BA8" opacity={0.55} scale={1.1} />
      {/* Near range — darkest, most detailed */}
      <MountainRange zPos={-15} yBase={-1.5} height={6} color="#3D5A73" opacity={0.7} scale={1.0} />
    </>
  );
}

// =========================================================
// CLOUDS — multi-layered drifting with parallax
// =========================================================
function CloudLayer({ yPos, zPos, speed, opacity, scale, count }) {
  const groupRef = useRef();

  const clouds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 60,
        y: yPos + (Math.random() - 0.5) * 1.5,
        z: zPos + (Math.random() - 0.5) * 4,
        scaleX: 3 + Math.random() * 6,
        scaleY: 0.8 + Math.random() * 1.2,
        opacity: opacity * (0.5 + Math.random() * 0.5),
        phase: Math.random() * 100,
      });
    }
    return arr;
  }, [yPos, zPos, count, opacity]);

  const cloudMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 1.0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform float uOpacity;
      varying vec2 vUv;
      void main() {
        vec2 center = vec2(0.5, 0.5);
        float d = distance(vUv, center);
        
        // Elliptical soft cloud shape
        float dx = (vUv.x - 0.5) * 2.0;
        float dy = (vUv.y - 0.5) * 3.0;
        float r = sqrt(dx * dx + dy * dy);
        float alpha = smoothstep(1.0, 0.3, r) * uOpacity;
        
        // Warm white cloud color
        vec3 col = vec3(1.0, 0.98, 0.96);
        // Subtle golden tint on bottom from sunrise
        col = mix(col, vec3(1.0, 0.94, 0.85), smoothstep(0.3, 0.7, vUv.y) * 0.3);
        
        gl_FragColor = vec4(col, alpha);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => {
    if (!groupRef.current) return;
    const t = c.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const cloud = clouds[i];
      if (!cloud) return;
      // Drift horizontally — infinite loop
      let x = cloud.x + t * speed + cloud.phase;
      x = ((x + 30) % 60) - 30;
      child.position.x = x;
      // Gentle vertical bob
      child.position.y = cloud.y + Math.sin(t * 0.2 + cloud.phase) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, c.z]} scale={[c.scaleX * scale, c.scaleY * scale, 1]}>
          <planeGeometry args={[1, 1]} />
          <primitive object={cloudMat.clone()} />
        </mesh>
      ))}
    </group>
  );
}

function Clouds() {
  return (
    <>
      {/* Background clouds — slow, faint, small */}
      <CloudLayer yPos={4} zPos={-28} speed={0.08} opacity={0.2} scale={1.0} count={8} />
      {/* Mid clouds — medium speed */}
      <CloudLayer yPos={2.5} zPos={-18} speed={0.15} opacity={0.35} scale={1.3} count={10} />
      {/* Foreground clouds — faster, more opaque, larger */}
      <CloudLayer yPos={1.0} zPos={-8} speed={0.25} opacity={0.3} scale={1.8} count={7} />
      {/* Low mist layer */}
      <CloudLayer yPos={-1.5} zPos={-12} speed={0.1} opacity={0.15} scale={2.5} count={6} />
    </>
  );
}

// =========================================================
// MIST / FOG BETWEEN MOUNTAIN LAYERS
// =========================================================
function MistLayer({ yPos, zPos, opacity }) {
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
        float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
        float vertFade = smoothstep(0.0, 0.4, vUv.y) * smoothstep(1.0, 0.6, vUv.y);
        
        // Wispy wave pattern
        float wave = sin(vUv.x * 8.0 + uTime * 0.15) * 0.5 + 0.5;
        wave *= sin(vUv.x * 3.0 - uTime * 0.08) * 0.5 + 0.5;
        
        float alpha = edgeFade * vertFade * wave * ${opacity.toFixed(2)};
        vec3 col = vec3(0.95, 0.95, 0.97);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  }), [opacity]);

  useFrame(({ clock: c }) => { mat.uniforms.uTime.value = c.getElapsedTime(); });

  return (
    <mesh position={[0, yPos, zPos]} scale={[60, 3, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}

function Mist() {
  return (
    <>
      <MistLayer yPos={0.5} zPos={-30} opacity={0.25} />
      <MistLayer yPos={-0.5} zPos={-20} opacity={0.3} />
      <MistLayer yPos={-1.0} zPos={-12} opacity={0.2} />
    </>
  );
}

// =========================================================
// SUN RAYS — volumetric light beams
// =========================================================
function SunRays() {
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
        // Rays fan out from top-center
        vec2 origin = vec2(0.5, 1.0);
        vec2 dir = vUv - origin;
        float angle = atan(dir.x, dir.y);
        
        // Create ray pattern
        float rays = sin(angle * 12.0 + uTime * 0.1) * 0.5 + 0.5;
        rays = pow(rays, 3.0);
        
        // Fade with distance from origin
        float dist = length(dir);
        float falloff = smoothstep(1.2, 0.0, dist);
        
        // Horizontal center bias
        float centerBias = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
        
        float alpha = rays * falloff * centerBias * 0.06;
        // Warm golden color
        vec3 col = vec3(1.0, 0.94, 0.78);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => { mat.uniforms.uTime.value = c.getElapsedTime(); });

  return (
    <mesh position={[0, 3, -20]} scale={[40, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={mat} />
    </mesh>
  );
}

// =========================================================
// FLOATING DUST PARTICLES — golden motes in sunlight
// =========================================================
function DustParticles() {
  const count = 200;
  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = -2 + Math.random() * 10;
      pos[i * 3 + 2] = -3 + Math.random() * -20;
      sz[i] = 0.6 + Math.random() * 1.2;
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
        vec3 pos = position;
        pos.y += sin(uTime * 0.3 + aPhase) * 0.4;
        pos.x += sin(uTime * 0.15 + aPhase * 1.5) * 0.3;
        float flicker = 0.3 + 0.7 * sin(uTime * 0.6 + aPhase);
        vAlpha = flicker * 0.3;
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
        gl_FragColor = vec4(0.95, 0.88, 0.65, alpha);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => { mat.uniforms.uTime.value = c.getElapsedTime(); });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <primitive object={mat} />
    </points>
  );
}

// =========================================================
// CAMERA PARALLAX
// =========================================================
function CameraController() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -0.6;
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
      <HimalayanSky />
      <Mountains />
      <Mist />
      <SunRays />
      <Clouds />
      <DustParticles />
      <CameraController />

      {/* Warm sunrise lighting */}
      <ambientLight color="#FFF5E8" intensity={1.4} />
      <directionalLight position={[0, 8, -15]} color="#FFE8C4" intensity={0.6} />
      <pointLight position={[0, 5, -30]} color="#FFD4A0" intensity={0.4} distance={50} />
    </>
  );
}

export default OceanBackground;
