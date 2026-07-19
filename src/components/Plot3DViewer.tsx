import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Plot } from '../types';


// ─── 3D Plot Ground ───────────────────────────────────────────────────────────
interface PlotGroundProps {
  lengthFt: number;
  widthFt: number;
  status: string;
}

function PlotGround({ lengthFt, widthFt, status }: PlotGroundProps) {
  // Normalize to 3D units (1 unit = 10ft)
  const l = lengthFt / 10;
  const w = widthFt / 10;

  const statusColors: Record<string, string> = {
    available: '#4ade80',
    booked: '#fb923c',
    sold: '#f87171',
  };
  const groundColor = statusColors[status] ?? '#4ade80';

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[l, w]} />
        <meshStandardMaterial color={groundColor} roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Boundary walls (low height) */}
      {[
        // Front wall
        { pos: [0, 0.05, w / 2] as [number, number, number], scale: [l, 0.1, 0.05] as [number, number, number] },
        // Back wall
        { pos: [0, 0.05, -w / 2] as [number, number, number], scale: [l, 0.1, 0.05] as [number, number, number] },
        // Left wall
        { pos: [-l / 2, 0.05, 0] as [number, number, number], scale: [0.05, 0.1, w] as [number, number, number] },
        // Right wall
        { pos: [l / 2, 0.05, 0] as [number, number, number], scale: [0.05, 0.1, w] as [number, number, number] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos} castShadow>
          <boxGeometry args={wall.scale} />
          <meshStandardMaterial color="#94a3b8" roughness={0.5} />
        </mesh>
      ))}

      {/* Gate post markers */}
      {([-l / 2 + 0.3, l / 2 - 0.3] as number[]).map((x, i) => (
        <mesh key={`gate-${i}`} position={[x, 0.3, w / 2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
          <meshStandardMaterial color="#d4a017" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* Plot number marker in centre */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[Math.min(l, w) * 0.12, 32]} />
        <meshStandardMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>

      {/* Placeholder house silhouette (very simplified box) */}
      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[l * 0.5, 0.8, w * 0.5]} />
          <meshStandardMaterial color="#e2d5c3" roughness={0.7} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <coneGeometry args={[l * 0.38, 0.5, 4]} />
          <meshStandardMaterial color="#c0392b" roughness={0.8} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 0.2, w * 0.26]} castShadow>
          <boxGeometry args={[0.2, 0.4, 0.02]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    </group>
  );
}

// ─── Road simulation ─────────────────────────────────────────────────────────
function RoadScene({ lengthFt, widthFt }: { lengthFt: number; widthFt: number }) {
  const l = lengthFt / 10;
  const w = widthFt / 10;
  const roadW = Math.max(l, w) * 0.4;

  return (
    <group>
      {/* Road to the front */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, w / 2 + roadW / 2]}>
        <planeGeometry args={[l + roadW * 2, roadW]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
      {/* Road marking dashes */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(i - 2) * (l / 5), -0.005, w / 2 + roadW / 2]}
        >
          <planeGeometry args={[0.15, roadW * 0.05]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}

      {/* Ground around */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[l * 4, w * 4]} />
        <meshStandardMaterial color="#6b7280" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Animated Camera Intro ────────────────────────────────────────────────────
function CameraIntro() {
  const t = useRef(0);

  useFrame((state, delta) => {
    t.current += delta * 0.3;
    state.camera.position.x = Math.sin(t.current) * 0.5;
  });

  return null;
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Plot3DViewerProps {
  plot: Plot;
}

const Plot3DViewer: React.FC<Plot3DViewerProps> = ({ plot }) => {
  const { length, width } = plot.dimensions;
  const l = length / 10;
  const w = width / 10;
  const camDistance = Math.max(l, w) * 1.8;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-800">
      <Canvas
        camera={{ position: [camDistance, camDistance * 0.8, camDistance], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <CameraIntro />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#b4d8ff" />

        {/* Sky environment */}
        <color attach="background" args={['#e0f2fe']} />
        <fog attach="fog" args={['#e0f2fe', 20, 60]} />

        {/* Scene content */}
        <PlotGround lengthFt={length} widthFt={width} status={plot.status} />
        <RoadScene lengthFt={length} widthFt={width} />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
};

export default Plot3DViewer;
