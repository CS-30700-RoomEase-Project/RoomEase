// "use client"
// import React from "react"
// import "./trash-can.css"

// const TrashCan = ({ onClick }) => {
//   return (
//     <div className="trash-can-container" onClick={onClick}>
//       <div className="trash-can-lid">
//         <div className="trash-can-lid-handle"></div>
//       </div>
//       <div className="trash-can-body">
//         <div className="trash-can-shine"></div>
//         <div className="trash-can-shadow"></div>
//       </div>
//     </div>
//   )
// }

// export default TrashCan

// TrashCan3D.jsx
"use client";

import { Cylinder, Torus } from '@react-three/drei';
import React, { useRef } from 'react';
import * as THREE from 'three';

const TrashCan = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 2, onClick }) => {
  const groupRef = useRef();

  // Dimensions (approximate, can be adjusted)
  const canHeight = 0.8;
  const canRadiusTop = 0.3;
  const canRadiusBottom = 0.25; // Slight taper
  const lidHeight = 0.1;
  const lidRadius = canRadiusTop + 0.02; // Lid slightly overhangs
  const handleRadius = 0.08;
  const handleTubeRadius = 0.015;

  // Material
  const canMaterial = new THREE.MeshStandardMaterial({
    color: '#808080', // Grey
    metalness: 0.7,
    roughness: 0.3,
  });

  const lidMaterial = new THREE.MeshStandardMaterial({
    color: '#707070', // Slightly darker grey for lid
    metalness: 0.7,
    roughness: 0.3,
  });

  const handleMaterial = new THREE.MeshStandardMaterial({
    color: '#505050',
    metalness: 0.8,
    roughness: 0.2,
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} onClick={onClick}>
      {/* Trash Can Body */}
      <Cylinder args={[canRadiusTop, canRadiusBottom, canHeight, 32]} material={canMaterial} castShadow receiveShadow>
        {/* You could add a plane inside for the "bottom" if needed, or use a closed cylinder */}
      </Cylinder>

      {/* Trash Can Lid */}
      <group position={[0, canHeight / 2 + lidHeight / 2 - 0.02, 0]}> {/* Position lid on top, slightly overlapping */}
        <Cylinder args={[lidRadius, lidRadius, lidHeight, 32, 1]} material={lidMaterial} castShadow receiveShadow>
           {/* Lid Handle (simple torus) */}
            <Torus args={[handleRadius, handleTubeRadius, 8, 24]} material={handleMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, lidHeight/2 + 0.005, 0]} castShadow />
            {/* Alternative box handle:
            <Box args={[0.15, 0.03, 0.05]} material={handleMaterial} position={[0, lidHeight / 2 + 0.01, 0]} castShadow />
            */}
        </Cylinder>
      </group>
    </group>
  );
};

export default TrashCan;