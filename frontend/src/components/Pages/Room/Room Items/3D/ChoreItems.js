// ChoreItems.jsx
"use client";

import { Html, useCursor } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import Broom from './Broom';
import TrashCan from './TrashCan';

const ChoreItems = ({
  onClick,
  enabled,
  position = [0, 0, 0],
  rotation = [0, -Math.PI / 2, 0],
  scale = 1,
}) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(enabled && hovered);

  const handleGroupClick = (event) => {
    if (enabled && onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  // Positions for items within the group
  const trashCanPosition = [-0.35, 0, 0];
  const broomPosition    = [0.3, -0.2, 0.05];
  const broomRotation    = [0, THREE.MathUtils.degToRad(-15), THREE.MathUtils.degToRad(15)];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleGroupClick}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
    >
      {/* Tooltip on hover */}
      {hovered && enabled && (
        <Html
          position={[0, 1.2, 0]}
          center
          occlude
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap'
          }}>
            Chores
          </div>
        </Html>
      )}

      {/* Trash Can */}
      <TrashCan position={trashCanPosition} />

      {/* Broom */}
      <Broom
        position={[
          broomPosition[0] + 0.45,
          -0.74,
          broomPosition[2]
        ]}
        rotation={broomRotation}
        scale={1.8}
      />
    </group>
  );
};

export default ChoreItems;
