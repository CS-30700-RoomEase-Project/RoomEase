"use client";
import { Box } from '@react-three/drei';
import React, { useMemo } from 'react';
import * as THREE from 'three';

const DiningTable = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const woodMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ color: '#773F1A', roughness: 0.6 }), []
  );

  const legHeight = 0.7;
  const legOffsetX = 0.9;
  const legOffsetZ = 0.4;

  const chairMaterial = useMemo(() =>
    new THREE.MeshStandardMaterial({ color: '#55342B', roughness: 0 }), []
  );

  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Tabletop */}
      <Box
        args={[2, 0.1, 1.4]}
        material={woodMaterial}
        position={[0, legHeight + 0.05, 0]}
        castShadow
      />

      {/* Table legs */}
      {[-1, 1].map((x) =>
        [-1, 1].map((z) => (
          <Box
            key={`${x}-${z}`}
            args={[0.1, legHeight, 0.1]}
            material={woodMaterial}
            position={[x * legOffsetX, legHeight / 2, z * legOffsetZ]}
            castShadow
          />
        ))
      )}

      {/* Chairs */}
      <Chair position={[0, 0, -.6]} rotation={[0, 0, 0]} material={chairMaterial} />
      <Chair position={[0, 0, .6]} rotation={[0, Math.PI, 0]} material={chairMaterial} />
      <Chair position={[-1, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={chairMaterial} />
      <Chair position={[1, 0, 0]} rotation={[0, -Math.PI / 2, 0]} material={chairMaterial} />
    </group>
  );
};

const Chair = ({ position = [0, 0, 0], rotation = [0, 0, 0], material }) => {
  const seatHeight = 0.45;
  const legHeight = 0.4;
  const backHeight = 0.8;

  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <Box args={[0.5, 0.1, 0.5]} position={[0, legHeight + 0.05, 0]} material={material} castShadow />

      {/* Legs */}
      {[-0.2, 0.2].map((x) =>
        [-0.2, 0.2].map((z) => (
          <Box
            key={`${x}-${z}`}
            args={[0.05, legHeight, 0.05]}
            position={[x, legHeight / 2, z]}
            material={material}
            castShadow
          />
        ))
      )}

      {/* Backrest */}
      <Box
        args={[0.5, backHeight, 0.05]}
        position={[0, legHeight + 0.4, -0.225]}
        material={material}
        castShadow
      />
    </group>
  );
};

export default DiningTable;
