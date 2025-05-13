// Trophy3D.jsx
import { Html } from "@react-three/drei";
import React, { useState } from "react";

export function Trophy3D({ onClick, position, rotation, scale }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      castShadow
      receiveShadow
      onPointerOver={e => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={e => { e.stopPropagation(); setHovered(false); }}
    >
      {/* Tooltip */}
      {hovered && (
        <Html
          position={[0, 1.4, 0]}
          center
          occlude
          style={{ pointerEvents: "none" }}
        >
          <div style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>
            Leaderboard
          </div>
        </Html>
      )}

      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={.6} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 32]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={.6} />
      </mesh>

      {/* Cup */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32, 1, true]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.6}
          roughness={.6}
          side={2}
        />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.6, 0.05, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={.6} />
      </mesh>

      {/* Handles */}
      <mesh position={[-0.6, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.05, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={.6} />
      </mesh>
      <mesh position={[0.6, 0.8, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.05, 16, 100, Math.PI]} />
        <meshStandardMaterial color="#FFD700" metalness={0.6} roughness={.6} />
      </mesh>
    </group>
  );
}
