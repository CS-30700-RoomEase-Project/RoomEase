// BulletinBoard.jsx
"use client";

import { Box, Html, RoundedBox, useCursor } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

const Note = ({ position, rotation, color, linesColor = '#00000033' }) => {
  const noteWidth = 0.6;
  const noteHeight = 0.6;
  const noteDepth = 0.01;
  const lineWidth = noteWidth * 0.8;
  const lineHeight = 0.005;
  const lineSpacing = 0.1;

  return (
    <group position={position} rotation={rotation}>
      <Box args={[noteWidth, noteHeight, noteDepth]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </Box>
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          args={[lineWidth, lineHeight, noteDepth + 0.001]}
          position={[0, noteHeight / 2 - lineSpacing * (i + 1.5), 0.001]}
        >
          <meshBasicMaterial color={linesColor} transparent opacity={0.5} />
        </Box>
      ))}
    </group>
  );
};

const Pin = ({ position, color }) => {
  const pinHeadRadius = 0.03;
  const pinShaftRadius = 0.007;
  const pinShaftHeight = 0.05;

  return (
    <group position={position}>
      <mesh position={[0, 0, pinShaftHeight / 2 + 0.01]}>
        <sphereGeometry args={[pinHeadRadius, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <cylinderGeometry args={[pinShaftRadius, pinShaftRadius, pinShaftHeight, 8]} />
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

function BulletinBoard({
  onClick,
  enabled,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(enabled && hovered);

  const handleClick = (e) => {
    if (enabled && onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  // Board dimensions & colors
  const boardW = 4, boardH = 1.8, frameTh = 0.1, corkD = 0.05;
  const frameColor = '#654321', corkColor = '#D2B48C';

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={e => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Tooltip */}
      {hovered && enabled && (
        <Html position={[0, boardH / 2 + 0.2, 0]} center occlude style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap'
          }}>
            Bulletin Board
          </div>
        </Html>
      )}

      {/* Frame */}
      <RoundedBox args={[boardW, boardH, frameTh]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.1} />
      </RoundedBox>

      {/* Cork */}
      <Box
        args={[boardW - frameTh * 1.5, boardH - frameTh * 1.5, corkD]}
        position={[0, 0, frameTh/2 - corkD/2 + 0.01]}
      >
        <meshStandardMaterial color={corkColor} roughness={0.9} />

        {/* Notes */}
        <Note
          position={[-boardW*0.25, boardH*0.15, corkD/2 + 0.005]}
          rotation={[0,0,THREE.MathUtils.degToRad(10)]}
          color="#FFFACD"
        />
        <Note
          position={[boardW*0.2, boardH*0.25, corkD/2 + 0.005]}
          rotation={[0,0,THREE.MathUtils.degToRad(-8)]}
          color="#ADD8E6"
        />
        <Note
          position={[-boardW*0.1, -boardH*0.2, corkD/2 + 0.005]}
          rotation={[0,0,THREE.MathUtils.degToRad(5)]}
          color="#90EE90"
        />

        {/* Pins */}
        <Pin position={[-boardW*0.25+0.2, boardH*0.15+0.2, corkD/2+0.015]} color="red" />
        <Pin position={[boardW*0.2-0.2, boardH*0.25+0.2, corkD/2+0.015]} color="blue" />
        <Pin position={[-boardW*0.1+0.2, -boardH*0.2+0.2, corkD/2+0.015]} color="green" />
        <Pin position={[boardW*0.3, -boardH*0.3, corkD/2+0.015]} color="yellow" />
      </Box>
    </group>
  );
}

export default BulletinBoard;
