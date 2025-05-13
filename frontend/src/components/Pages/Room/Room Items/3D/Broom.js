// import React from "react"
// import "./broom.css"

// function Broom() {
//   return (
//     <div className="broom-container">
//       <div className="broom-handle"></div>
//       <div className="broom-connector"></div>
//       <div className="broom-head">
//         <div className="broom-bristles"></div>
//       </div>
//     </div>
//   )
// }

// export default Broom

// Broom3D.jsx
"use client";

import { Box, Cylinder } from '@react-three/drei';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

const Broom = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 4 }) => {
  const groupRef = useRef();

  // Dimensions
  const handleHeight = 1.2;
  const handleRadius = 0.025;
  const connectorHeight = 0.08;
  const connectorRadius = 0.04;
  const headWidth = 0.4;
  const headHeight = 0.1;
  const headDepth = 0.08;
  const bristleLength = 0.25;
  const bristleThickness = 0.01;
  const bristleCount = 10;

  // 🧠 FIX: Stable material instances
  const handleMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#A0522D', roughness: 0.8 }),
    []
  );
  const connectorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#505050', metalness: 0.6, roughness: 0.4 }),
    []
  );
  const headMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#704214', roughness: 0.7 }),
    []
  );
  const bristleMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#D2B48C', roughness: 0.9 }),
    []
  );

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Broom Handle */}
      <Cylinder
        args={[handleRadius, handleRadius, handleHeight, 16]}
        material={handleMaterial}
        position={[0, bristleLength + headHeight + connectorHeight + handleHeight / 2, 0]}
        castShadow
      />

      {/* Connector */}
      <Cylinder
        args={[connectorRadius, connectorRadius * 0.8, connectorHeight, 16]}
        material={connectorMaterial}
        position={[0, bristleLength + headHeight + connectorHeight / 2, 0]}
        castShadow
      />

      {/* Head */}
      <Box
        args={[headWidth, headHeight, headDepth]}
        material={headMaterial}
        position={[0, bristleLength + headHeight / 2, 0]}
        castShadow
      />

      {/* Bristles */}
      <group position={[0, bristleLength / 2, 0]}>
        {Array.from({ length: bristleCount }).map((_, i) => {
          const angle = (i / (bristleCount - 1) - 0.5) * (Math.PI / 6);
          const xOffset = (i / (bristleCount - 1) - 0.5) * (headWidth * 0.8);
          return (
            <Box
              key={i}
              args={[bristleThickness * 2, bristleLength, bristleThickness * 4]}
              material={bristleMaterial}
              position={[xOffset, 0, 0]}
              rotation={[0, 0, angle]}
              castShadow
            />
          );
        })}
      </group>
    </group>
  );
};

export default Broom;