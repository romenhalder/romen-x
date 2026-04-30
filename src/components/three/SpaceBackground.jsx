import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ----- GLSL Noise helpers -----
const NOISE_GLSL = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }
  float fbm(vec3 p,int octaves){
    float value=0.0; float amplitude=0.5; float frequency=1.0;
    for(int i=0;i<octaves;i++){value+=amplitude*snoise(p*frequency);amplitude*=0.5;frequency*=2.0;}
    return value;
  }
`;

// =====================================================
// SPACE STATION — cylindrical body with solar panels
// =====================================================
function SpaceStation() {
  const ref = useRef();
  const materials = useMemo(() => ({
    hull: new THREE.MeshStandardMaterial({ color: '#B0B8C8', roughness: 0.3, metalness: 0.8 }),
    panel: new THREE.MeshStandardMaterial({ color: '#1a3570', roughness: 0.5, metalness: 0.6, emissive: '#0a1945', emissiveIntensity: 0.3 }),
    panelFrame: new THREE.MeshStandardMaterial({ color: '#8899AA', roughness: 0.4, metalness: 0.7 }),
    accent: new THREE.MeshStandardMaterial({ color: '#0EA5E9', roughness: 0.3, metalness: 0.5, emissive: '#0EA5E9', emissiveIntensity: 0.6 }),
    antenna: new THREE.MeshStandardMaterial({ color: '#667788', roughness: 0.5, metalness: 0.6 }),
  }), []);

  useFrame(({ clock: c }) => {
    if (!ref.current) return;
    const t = c.getElapsedTime();
    ref.current.rotation.y = t * 0.03;
    ref.current.position.y = Math.sin(t * 0.15) * 0.1;
  });

  return (
    <group ref={ref} position={[3.5, 0.5, -6]} rotation={[0.2, 0, 0.05]}>
      {/* Main hull — central cylinder */}
      <mesh material={materials.hull}>
        <cylinderGeometry args={[0.35, 0.35, 2.8, 16]} />
      </mesh>
      {/* Front dome */}
      <mesh position={[0, 1.4, 0]} material={materials.hull}>
        <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Back dome */}
      <mesh position={[0, -1.4, 0]} rotation={[Math.PI, 0, 0]} material={materials.hull}>
        <sphereGeometry args={[0.35, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Pressurized modules (smaller cylinders branching off) */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.hull}>
        <cylinderGeometry args={[0.2, 0.2, 1.2, 12]} />
      </mesh>
      <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.hull}>
        <cylinderGeometry args={[0.18, 0.18, 1.0, 12]} />
      </mesh>

      {/* Solar panel arrays — LEFT */}
      <group position={[1.6, 0, 0]}>
        <mesh material={materials.panelFrame}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
        </mesh>
        {/* Panel arm */}
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.panelFrame}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
        </mesh>
        {/* Panel 1 */}
        <mesh position={[0.8, 0.5, 0]} material={materials.panel}>
          <boxGeometry args={[1.4, 0.9, 0.03]} />
        </mesh>
        {/* Panel 2 */}
        <mesh position={[0.8, -0.5, 0]} material={materials.panel}>
          <boxGeometry args={[1.4, 0.9, 0.03]} />
        </mesh>
        {/* Panel grid lines */}
        {[-0.35, 0, 0.35].map((x) => (
          <mesh key={`gl${x}`} position={[0.8 + x, 0.5, 0.02]} material={materials.panelFrame}>
            <boxGeometry args={[0.02, 0.88, 0.01]} />
          </mesh>
        ))}
      </group>

      {/* Solar panel arrays — RIGHT */}
      <group position={[-1.6, 0, 0]} scale={[-1, 1, 1]}>
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.panelFrame}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 4]} />
        </mesh>
        <mesh position={[0.8, 0.5, 0]} material={materials.panel}>
          <boxGeometry args={[1.4, 0.9, 0.03]} />
        </mesh>
        <mesh position={[0.8, -0.5, 0]} material={materials.panel}>
          <boxGeometry args={[1.4, 0.9, 0.03]} />
        </mesh>
      </group>

      {/* Antenna */}
      <mesh position={[0, 1.6, 0.2]} material={materials.antenna}>
        <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
      </mesh>
      <mesh position={[0, 1.9, 0.2]} material={materials.antenna}>
        <sphereGeometry args={[0.04, 8, 8]} />
      </mesh>

      {/* Docking port light — glowing accent */}
      <mesh position={[0, 1.42, 0.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <primitive object={materials.accent} />
      </mesh>
      <mesh position={[0, -1.42, 0.28]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <primitive object={materials.accent} />
      </mesh>

      {/* Window lights along hull */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y) => (
        <mesh key={`w${y}`} position={[0, y, 0.36]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#4ECDC4" emissive="#4ECDC4" emissiveIntensity={2} />
        </mesh>
      ))}
    </group>
  );
}

// =====================================================
// ASTRONAUT — orbiting the space station
// =====================================================
function Astronaut() {
  const groupRef = useRef();
  const tetherRef = useRef();

  const materials = useMemo(() => ({
    suit: new THREE.MeshStandardMaterial({ color: '#F0F0F0', roughness: 0.6, metalness: 0.15 }),
    visor: new THREE.MeshStandardMaterial({ color: '#1a3a5c', roughness: 0.08, metalness: 0.85, transparent: true, opacity: 0.88 }),
    visorGold: new THREE.MeshStandardMaterial({ color: '#C8A020', roughness: 0.15, metalness: 0.95, emissive: '#C8A020', emissiveIntensity: 0.15 }),
    pack: new THREE.MeshStandardMaterial({ color: '#CCCCCC', roughness: 0.5, metalness: 0.3 }),
    glow: new THREE.MeshStandardMaterial({ color: '#0EA5E9', emissive: '#0EA5E9', emissiveIntensity: 1.5 }),
  }), []);

  const stationPos = useMemo(() => new THREE.Vector3(3.5, 0.5, -6), []);

  useFrame(({ clock: c }) => {
    if (!groupRef.current) return;
    const t = c.getElapsedTime();

    // Orbit around the space station
    const orbitRadius = 3.2;
    const orbitSpeed = 0.15;
    const angle = t * orbitSpeed;
    const bobY = Math.sin(t * 0.4) * 0.25;

    groupRef.current.position.x = stationPos.x + Math.cos(angle) * orbitRadius;
    groupRef.current.position.y = stationPos.y + bobY + Math.sin(angle * 0.7) * 0.5;
    groupRef.current.position.z = stationPos.z + Math.sin(angle) * orbitRadius;

    // Face the direction of travel with slight tumble
    groupRef.current.rotation.y = -angle + Math.PI / 2;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.12;
    groupRef.current.rotation.z = Math.cos(t * 0.25) * 0.1;

    // Update tether — curved line from astronaut to station
    if (tetherRef.current) {
      const positions = tetherRef.current.geometry.attributes.position.array;
      // Start: astronaut
      positions[0] = groupRef.current.position.x;
      positions[1] = groupRef.current.position.y - 0.1;
      positions[2] = groupRef.current.position.z;
      // Mid: sagging curve
      const midX = (groupRef.current.position.x + stationPos.x) * 0.5;
      const midY = Math.min(groupRef.current.position.y, stationPos.y) - 0.6;
      const midZ = (groupRef.current.position.z + stationPos.z) * 0.5;
      positions[3] = midX;
      positions[4] = midY;
      positions[5] = midZ;
      // End: station
      positions[6] = stationPos.x;
      positions[7] = stationPos.y;
      positions[8] = stationPos.z;
      tetherRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const tetherGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3));
    return g;
  }, []);

  return (
    <>
      {/* Tether */}
      <line ref={tetherRef}>
        <primitive object={tetherGeo} />
        <lineBasicMaterial color="#88CCFF" transparent opacity={0.35} />
      </line>

      <group ref={groupRef} scale={0.42}>
        {/* Torso */}
        <mesh material={materials.suit}>
          <capsuleGeometry args={[0.55, 1.2, 8, 16]} />
        </mesh>
        {/* Helmet */}
        <mesh position={[0, 1.1, 0]} material={materials.suit}>
          <sphereGeometry args={[0.55, 20, 20]} />
        </mesh>
        {/* Visor */}
        <mesh position={[0, 1.1, 0.32]} material={materials.visor}>
          <sphereGeometry args={[0.42, 16, 16, 0, Math.PI * 1.2, Math.PI * 0.2, Math.PI * 0.6]} />
        </mesh>
        {/* Visor gold trim */}
        <mesh position={[0, 1.1, 0.28]} material={materials.visorGold}>
          <torusGeometry args={[0.42, 0.022, 8, 24]} />
        </mesh>
        {/* Left arm — extended like reaching out */}
        <mesh position={[-0.7, 0.35, 0.2]} rotation={[0.4, 0, 0.7]} material={materials.suit}>
          <capsuleGeometry args={[0.18, 0.85, 4, 8]} />
        </mesh>
        {/* Right arm — holding tether */}
        <mesh position={[0.65, 0.1, -0.1]} rotation={[-0.2, 0, -0.6]} material={materials.suit}>
          <capsuleGeometry args={[0.18, 0.85, 4, 8]} />
        </mesh>
        {/* Left leg */}
        <mesh position={[-0.25, -1.0, 0.1]} rotation={[0.15, 0, 0]} material={materials.suit}>
          <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
        </mesh>
        {/* Right leg */}
        <mesh position={[0.25, -1.05, -0.05]} rotation={[-0.1, 0, 0]} material={materials.suit}>
          <capsuleGeometry args={[0.2, 0.8, 4, 8]} />
        </mesh>
        {/* Jetpack */}
        <mesh position={[0, 0.1, -0.64]} material={materials.pack}>
          <boxGeometry args={[0.55, 0.8, 0.32]} />
        </mesh>
        {/* Jetpack nozzles */}
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, -0.45, -0.65]} material={materials.pack}>
            <cylinderGeometry args={[0.05, 0.08, 0.2, 8]} />
          </mesh>
        ))}
        {/* Helmet light */}
        <mesh position={[0, 1.55, 0.15]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <primitive object={materials.glow} />
        </mesh>
      </group>
    </>
  );
}

// =====================================================
// PROCEDURAL EARTH — positioned to the left
// =====================================================
function Earth() {
  const meshRef = useRef();
  const cloudsRef = useRef();

  const earthMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(1.5, 1, 0.5).normalize() },
    },
    vertexShader: `
      varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
      void main(){
        vNormal = normalize(normalMatrix * normal); vPosition = position; vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      ${NOISE_GLSL}
      uniform float uTime; uniform vec3 uLightDir;
      varying vec3 vNormal; varying vec3 vPosition; varying vec2 vUv;
      void main(){
        vec3 p = normalize(vPosition) * 2.4;
        float continent = fbm(p, 5);
        float isLand = smoothstep(0.04, 0.18, continent);
        vec3 oceanColor = mix(vec3(0.01,0.12,0.45), vec3(0.02,0.28,0.62), fbm(p*3.0,2)*0.5+0.5);
        float mf = smoothstep(0.15, 0.38, continent);
        vec3 lowland = mix(vec3(0.13,0.42,0.13), vec3(0.26,0.52,0.18), fbm(p*5.0,2)*0.5+0.5);
        vec3 highland = mix(vec3(0.38,0.28,0.16), vec3(0.62,0.58,0.52), mf);
        vec3 snow = vec3(0.92,0.94,0.98);
        vec3 landColor = mix(lowland, highland, mf);
        float snowCap = smoothstep(0.28,0.42,continent)*(1.0-smoothstep(0.4,0.55,continent));
        landColor = mix(landColor, snow, snowCap);
        float lat = abs(vUv.y-0.5)*2.0;
        float polarIce = smoothstep(0.78,0.95,lat);
        vec3 surfaceColor = mix(oceanColor, landColor, isLand);
        surfaceColor = mix(surfaceColor, snow, polarIce);
        float diff = max(dot(vNormal, uLightDir), 0.0);
        surfaceColor *= (0.15 + diff * 0.85);
        vec3 viewDir = normalize(cameraPosition - vPosition);
        vec3 halfDir = normalize(uLightDir + viewDir);
        float spec = pow(max(dot(vNormal,halfDir),0.0),40.0)*(1.0-isLand)*0.5;
        surfaceColor += vec3(spec);
        float nightSide = 1.0-smoothstep(0.0,0.35,diff);
        float cityGlow = fbm(p*8.0,2);
        cityGlow = smoothstep(0.35,0.5,cityGlow)*isLand*nightSide*0.6;
        surfaceColor += vec3(1.0,0.6,0.2)*cityGlow;
        gl_FragColor = vec4(surfaceColor, 1.0);
      }
    `,
  }), []);

  const cloudMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uLightDir: { value: new THREE.Vector3(1.5, 1, 0.5).normalize() } },
    transparent: true, side: THREE.FrontSide,
    vertexShader: `
      varying vec3 vPosition; varying vec3 vNormal;
      void main(){ vPosition=position; vNormal=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `,
    fragmentShader: `
      ${NOISE_GLSL}
      uniform float uTime; uniform vec3 uLightDir;
      varying vec3 vPosition; varying vec3 vNormal;
      void main(){
        vec3 p=normalize(vPosition)*2.6+vec3(uTime*0.008,0.0,0.0);
        float cloud=fbm(p,4); cloud=smoothstep(0.1,0.4,cloud);
        float diff=max(dot(vNormal,uLightDir),0.3);
        gl_FragColor=vec4(vec3(diff),cloud*0.78);
      }
    `,
  }), []);

  const atmosphereMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uLightDir: { value: new THREE.Vector3(1.5, 1, 0.5).normalize() } },
    transparent: true, side: THREE.FrontSide,
    vertexShader: `
      varying vec3 vNormal; varying vec3 vViewDir;
      void main(){
        vNormal=normalize(normalMatrix*normal);
        vViewDir=normalize(cameraPosition-(modelMatrix*vec4(position,1.0)).xyz);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uLightDir; varying vec3 vNormal; varying vec3 vViewDir;
      void main(){
        float fresnel=pow(1.0-max(dot(vNormal,vViewDir),0.0),3.0);
        vec3 atmColor=mix(vec3(0.2,0.5,1.0),vec3(0.53,0.81,0.98),fresnel);
        float lightMod=max(dot(vNormal,uLightDir),0.0);
        gl_FragColor=vec4(atmColor,fresnel*0.55*(0.3+lightMod*0.7));
      }
    `,
  }), []);

  useFrame(({ clock: c }) => {
    const t = c.getElapsedTime();
    if (meshRef.current) { meshRef.current.rotation.y = t * 0.015; earthMat.uniforms.uTime.value = t; }
    if (cloudsRef.current) { cloudsRef.current.rotation.y = t * 0.02; cloudMat.uniforms.uTime.value = t; }
  });

  return (
    <group position={[-4.5, -1.5, -8]}>
      <mesh ref={meshRef}><sphereGeometry args={[3.0, 64, 64]} /><primitive object={earthMat} /></mesh>
      <mesh ref={cloudsRef}><sphereGeometry args={[3.08, 48, 48]} /><primitive object={cloudMat} /></mesh>
      <mesh><sphereGeometry args={[3.2, 48, 48]} /><primitive object={atmosphereMat} /></mesh>
    </group>
  );
}

// =====================================================
// MOON — orbiting around Earth
// =====================================================
function Moon() {
  const ref = useRef();
  const glowRef = useRef();
  const earthCenter = useMemo(() => new THREE.Vector3(-4.5, -1.5, -8), []);

  const moonMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uLightDir: { value: new THREE.Vector3(1.5, 1, 0.5).normalize() } },
    vertexShader: `
      varying vec3 vNormal; varying vec3 vPosition;
      void main(){ vNormal=normalize(normalMatrix*normal); vPosition=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }
    `,
    fragmentShader: `
      ${NOISE_GLSL}
      uniform vec3 uLightDir; varying vec3 vNormal; varying vec3 vPosition;
      void main(){
        vec3 p=normalize(vPosition)*3.0;
        float base=fbm(p,3)*0.5+0.5;
        float craterBase=0.68+base*0.14;
        for(int i=0;i<4;i++){
          vec3 cs=vec3(float(i)*2.1,float(i)*1.7,float(i)*0.9);
          float d=length(p-cs*0.4);
          float ring=1.0-smoothstep(0.25,0.35,abs(d-0.28))*0.4;
          craterBase*=ring;
        }
        float diff=max(dot(vNormal,uLightDir),0.1);
        vec3 color=vec3(craterBase)*(0.1+diff*0.9);
        gl_FragColor=vec4(color,1.0);
      }
    `,
  }), []);

  // Glow material for the moon
  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {},
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: `
      varying vec3 vNormal; varying vec3 vViewDir;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(cameraPosition - (modelMatrix * vec4(position,1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal; varying vec3 vViewDir;
      void main(){
        float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
        gl_FragColor = vec4(0.85, 0.88, 0.95, fresnel * 0.3);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => {
    if (!ref.current) return;
    const t = c.getElapsedTime();

    // Orbit parameters
    const orbitRadius = 6.5;
    const orbitSpeed = 0.08; // ~78 second full orbit
    const tiltAngle = 0.25; // slight orbital tilt
    const angle = t * orbitSpeed;

    // Compute orbit position around Earth
    const x = earthCenter.x + Math.cos(angle) * orbitRadius;
    const y = earthCenter.y + Math.sin(angle) * Math.sin(tiltAngle) * orbitRadius * 0.3;
    const z = earthCenter.z + Math.sin(angle) * orbitRadius;

    ref.current.position.set(x, y, z);
    ref.current.rotation.y = t * 0.08; // slow self-rotation
  });

  return (
    <group ref={ref}>
      {/* Moon surface */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <primitive object={moonMat} />
      </mesh>
      {/* Subtle glow rim */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.95, 24, 24]} />
        <primitive object={glowMat} />
      </mesh>
    </group>
  );
}

// =====================================================
// STARS — 6000 twinkling points
// =====================================================
function Stars() {
  const count = 6000;
  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 30 + Math.random() * 15;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = Math.random() < 0.1 ? 2.5 : Math.random() < 0.3 ? 1.5 : 0.9;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, sizes: sz, phases: ph };
  }, []);

  const starMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    transparent: true,
    vertexShader: `
      attribute float aSize; attribute float aPhase;
      uniform float uTime; varying float vAlpha;
      void main(){
        float twinkle=0.7+0.3*sin(uTime*2.0+aPhase);
        vAlpha=twinkle; gl_PointSize=aSize*twinkle;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main(){
        float d=distance(gl_PointCoord,vec2(0.5));
        if(d>0.5)discard;
        float alpha=smoothstep(0.5,0.0,d)*vAlpha;
        gl_FragColor=vec4(1.0,0.97,0.9,alpha);
      }
    `,
  }), []);

  useFrame(({ clock: c }) => { starMat.uniforms.uTime.value = c.getElapsedTime(); });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <primitive object={starMat} />
    </points>
  );
}

// =====================================================
// SHOOTING STARS
// =====================================================
function ShootingStar() {
  const ref = useRef();
  const stateRef = useRef({ active: false, next: 3 + Math.random() * 5 });
  const startPos = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());
  const progress = useRef(0);

  useFrame(({ clock: c }) => {
    const t = c.getElapsedTime();
    if (!stateRef.current.active && t > stateRef.current.next) {
      stateRef.current.active = true;
      progress.current = 0;
      startPos.current.set((Math.random() - 0.5) * 30, 8 + Math.random() * 6, -10 - Math.random() * 8);
      dir.current.set((Math.random() - 0.5) * 15, -4 - Math.random() * 6, (Math.random() - 0.5) * 4).normalize();
    }
    if (stateRef.current.active) {
      progress.current += 0.015;
      if (ref.current) {
        const pos = ref.current.geometry.attributes.position.array;
        pos[0] = startPos.current.x + dir.current.x * progress.current * 14;
        pos[1] = startPos.current.y + dir.current.y * progress.current * 14;
        pos[2] = startPos.current.z + dir.current.z * progress.current * 14;
        pos[3] = startPos.current.x + dir.current.x * (progress.current - 0.08) * 14;
        pos[4] = startPos.current.y + dir.current.y * (progress.current - 0.08) * 14;
        pos[5] = startPos.current.z + dir.current.z * (progress.current - 0.08) * 14;
        ref.current.geometry.attributes.position.needsUpdate = true;
        ref.current.material.opacity = Math.sin(progress.current * Math.PI) * 0.9;
      }
      if (progress.current >= 1) {
        stateRef.current.active = false;
        stateRef.current.next = t + 5 + Math.random() * 8;
      }
    }
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);

  return (
    <line ref={ref}>
      <primitive object={geo} />
      <lineBasicMaterial color="#C8DEFF" transparent opacity={0} linewidth={2} />
    </line>
  );
}

// =====================================================
// NEBULA CLOUDS
// =====================================================
function Nebula() {
  const nebulas = useMemo(() => [
    { pos: [-8, 4, -22], color1: '#4B0082', color2: '#1a0050', rot: 0.2 },
    { pos: [10, -3, -24], color1: '#3d0040', color2: '#800060', rot: -0.1 },
    { pos: [-3, 8, -26], color1: '#00003a', color2: '#1a0050', rot: 0.3 },
    { pos: [6, 6, -23], color1: '#200020', color2: '#400040', rot: -0.15 },
  ], []);

  return (
    <>
      {nebulas.map((n, i) => {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uColor1: { value: new THREE.Color(n.color1) },
            uColor2: { value: new THREE.Color(n.color2) },
          },
          transparent: true, side: THREE.DoubleSide, depthWrite: false,
          vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
          fragmentShader: `
            ${NOISE_GLSL}
            uniform float uTime; uniform vec3 uColor1; uniform vec3 uColor2; varying vec2 vUv;
            void main(){
              vec2 p=(vUv-0.5)*3.0;
              float n=fbm(vec3(p*1.2,uTime*0.04),4);
              float alpha=smoothstep(0.3,-0.1,length(p))*(0.5+n*0.5)*0.16;
              vec3 color=mix(uColor1,uColor2,n*0.5+0.5);
              gl_FragColor=vec4(color,alpha);
            }
          `,
        });
        return (
          <mesh key={i} position={n.pos} rotation={[n.rot, i * 0.5, 0]}>
            <planeGeometry args={[14, 14]} />
            <primitive object={mat} />
          </mesh>
        );
      })}
    </>
  );
}

// =====================================================
// MAIN SCENE EXPORT
// =====================================================
export function SpaceBackground() {
  return (
    <>
      <ambientLight intensity={0.14} />
      <directionalLight position={[8, 4, 6]} color="#FFF5CC" intensity={1.3} />
      <pointLight position={[3.5, 0.5, -6]} color="#0EA5E9" intensity={0.5} distance={8} />

      <Stars />
      <Nebula />
      <Earth />
      <Moon />
      <SpaceStation />
      <Astronaut />
      {[1, 2, 3].map((i) => <ShootingStar key={i} />)}
    </>
  );
}

export default SpaceBackground;
