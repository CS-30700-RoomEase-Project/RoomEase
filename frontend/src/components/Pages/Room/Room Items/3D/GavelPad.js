"use client";
import { Html } from '@react-three/drei';
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function GavelPad({ position = [0, 0, 0], onClick, enabled = true }) {
  const padRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Add subtle hover scaling
  useFrame(() => {
    if (padRef.current) {
      padRef.current.scale.setScalar(hovered ? 1.05 : 1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={padRef}
        onClick={enabled ? onClick : undefined}
        onPointerOver={() => enabled && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
        <meshStandardMaterial
          color="#3e2f1c"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {hovered && enabled && (
        <Html position={[0, 0.3, 0]} center occlude>
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>
            Submit Dispute
          </div>
        </Html>
      )}
    </group>
  );
}

export default GavelPad;
