import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const EMBER = "#e85d3a";

function Tube({ from, to, r = 0.06, color = "#222" }: { from: [number, number, number]; to: [number, number, number]; r?: number; color?: string }) {
  const { pos, quat, len } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const dir = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return { pos: a.add(b).multiplyScalar(0.5), quat: q, len: dir.length() };
  }, [from, to]);
  return (
    <mesh position={pos} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, len, 16]} />
      <meshStandardMaterial color={color} metalness={0.9} roughness={0.25} />
    </mesh>
  );
}

function Wheel({ x }: { x: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z -= Math.min(d, 0.05) * 4; });
  return (
    <group position={[x, 0.75, 0]}>
      <group ref={ref}>
        <mesh castShadow>
          <torusGeometry args={[0.72, 0.17, 20, 48]} />
          <meshStandardMaterial color="#111" roughness={0.85} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.56, 0.035, 12, 48]} />
          <meshStandardMaterial color={EMBER} metalness={0.6} roughness={0.3} emissive={EMBER} emissiveIntensity={0.4} />
        </mesh>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
            <boxGeometry args={[1.1, 0.06, 0.04]} />
            <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 20]} />
          <meshStandardMaterial color="#aaa" metalness={1} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

function Bike() {
  const g = useRef<THREE.Group>(null);
  useFrame((state, d) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    const target = state.pointer.x * 0.6 + t * 0.25;
    g.current.rotation.y += (target - g.current.rotation.y) * (1 - Math.exp(-3 * Math.min(d, 0.05)));
    g.current.rotation.x = state.pointer.y * -0.08;
    g.current.position.y = Math.sin(t * 1.5) * 0.05 - 1;
  });
  return (
    <group ref={g} position={[0, -1, 0]}>
      <Wheel x={-1.5} />
      <Wheel x={1.6} />
      {/* frame */}
      <Tube from={[-1.5, 0.75, 0.12]} to={[-0.2, 1.1, 0.12]} r={0.05} />
      <Tube from={[-1.5, 0.75, -0.12]} to={[-0.2, 1.1, -0.12]} r={0.05} />
      <Tube from={[-0.2, 1.1, 0]} to={[1.0, 1.9, 0]} r={0.09} color="#333" />
      <Tube from={[-0.2, 1.1, 0]} to={[-0.6, 1.85, 0]} r={0.07} color="#333" />
      {/* fork */}
      <Tube from={[1.6, 0.75, 0.15]} to={[1.05, 2.2, 0.15]} r={0.055} color="#bbb" />
      <Tube from={[1.6, 0.75, -0.15]} to={[1.05, 2.2, -0.15]} r={0.055} color="#bbb" />
      <Tube from={[1.0, 2.35, -0.6]} to={[1.0, 2.35, 0.6]} r={0.04} color="#111" />
      {/* engine */}
      <mesh position={[0.15, 1.15, 0]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.35} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0.15, 1.0 + i * 0.12, 0]}>
          <boxGeometry args={[1.0, 0.04, 0.62]} />
          <meshStandardMaterial color="#666" metalness={1} roughness={0.2} />
        </mesh>
      ))}
      {/* tank */}
      <mesh position={[0.45, 1.95, 0]} scale={[1, 0.55, 0.6]} castShadow>
        <sphereGeometry args={[0.6, 32, 24]} />
        <meshStandardMaterial color={EMBER} metalness={0.5} roughness={0.2} />
      </mesh>
      {/* seat */}
      <mesh position={[-0.55, 1.88, 0]} castShadow>
        <boxGeometry args={[1.0, 0.16, 0.42]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.9} />
      </mesh>
      <mesh position={[-1.2, 1.85, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.5, 0.08, 0.3]} />
        <meshStandardMaterial color={EMBER} metalness={0.5} roughness={0.3} />
      </mesh>
      {/* exhaust */}
      <Tube from={[0.0, 0.8, 0.35]} to={[-1.4, 1.15, 0.38]} r={0.09} color="#c9c9c9" />
      {/* headlight */}
      <mesh position={[1.25, 2.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.17, 0.2, 24]} />
        <meshStandardMaterial color="#fff2d0" emissive="#ffd9a0" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[1.6, 2.1, 0]} color="#ffd9a0" intensity={4} distance={4} />
    </group>
  );
}

function Sparks() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 260;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14;
      p[i * 3 + 1] = Math.random() * 8 - 2;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, []);
  useFrame((_, d) => {
    const a = geo.attributes.position as THREE.BufferAttribute;
    const dt = Math.min(d, 0.05);
    for (let i = 0; i < a.count; i++) {
      let y = a.getY(i) + dt * (0.3 + (i % 7) * 0.08);
      if (y > 6) y = -2;
      a.setY(i, y);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={EMBER} size={0.05} transparent opacity={0.85} />
    </points>
  );
}

export default function Moto3D() {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.2, 7.5], fov: 42 }}>
      <fog attach="fog" args={["#141414", 7, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <pointLight position={[-4, 2, -2]} color={EMBER} intensity={30} distance={12} />
      <pointLight position={[4, 0, 3]} color="#8aa" intensity={8} distance={10} />
      <Bike />
      <Sparks />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1, 0]} receiveShadow>
        <circleGeometry args={[6, 64]} />
        <meshStandardMaterial color="#1c1c1c" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.99, 0]}>
        <ringGeometry args={[3.2, 3.26, 96]} />
        <meshBasicMaterial color={EMBER} />
      </mesh>
    </Canvas>
  );
}
