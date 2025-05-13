// "use client"
// import "./bulletin-board.css"

// function BulletinBoard({ onClick, enabled }) {
//   return (
//     <div
//       className="bulletin-board-container"
//       onClick={onClick}
//       title={enabled ? "Bulletin Board" : ""}
//       style={{
//         cursor: enabled ? "pointer" : "default",
//         pointerEvents: enabled ? "auto" : "none",
//       }}
//     >
//       <div className="bulletin-frame">
//         <div className="bulletin-cork">
//           <div className="bulletin-note yellow">
//             <div className="note-lines"></div>
//           </div>
//           <div className="bulletin-note blue">
//             <div className="note-lines"></div>
//           </div>
//           <div className="bulletin-note green">
//             <div className="note-lines"></div>
//           </div>
//           <div className="bulletin-pin red"></div>
//           <div className="bulletin-pin blue"></div>
//           <div className="bulletin-pin green"></div>
//           <div className="bulletin-pin yellow"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default BulletinBoard

// BulletinBoard3D.jsx
"use client";

import { Box, Cylinder, RoundedBox, Sphere, useCursor } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';

const Note = ({ position, rotation, color, linesColor = '#00000033' }) => {
  const noteWidth = 0.6;
  const noteHeight = 0.6;
  const noteDepth = 0.01;
  const lineWidth = noteWidth * 0.8;
  const lineHeight = 0.005; // Very thin lines
  const lineSpacing = 0.1;

  return (
    <group position={position} rotation={rotation}>
      <Box args={[noteWidth, noteHeight, noteDepth]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </Box>
      {/* Note Lines - decorative */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={i}
          args={[lineWidth, lineHeight, noteDepth + 0.001]} // Slightly above the note
          position={[0, noteHeight / 2 - lineSpacing * (i + 1.5) , 0.001]}
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
      <Sphere args={[pinHeadRadius, 16, 16]} position={[0, 0, pinShaftHeight / 2 + 0.01]}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </Sphere>
      <Cylinder args={[pinShaftRadius, pinShaftRadius, pinShaftHeight, 8]} position={[0, 0, 0.01]}>
        <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
      </Cylinder>
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
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  useCursor(enabled && hovered);

  // Dimensions
  const boardWidth = 4;
  const boardHeight = 1.8;
  const frameThickness = 0.1;
  const corkDepth = 0.05;

  // Colors
  const frameColor = '#654321'; // Brown
  const corkColor = '#D2B48C'; // Tan / Cork color

  const handleBoardClick = (event) => {
    if (enabled && onClick) {
      event.stopPropagation(); // Important if this is part of a larger clickable scene
      onClick(event);
    }
  };

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Frame */}
      <RoundedBox
        args={[boardWidth, boardHeight, frameThickness]} // width, height, depth
        radius={0.05}
        smoothness={4}
        onClick={handleBoardClick}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.1} />
      </RoundedBox>

      {/* Cork Area */}
      <Box
        args={[
          boardWidth - frameThickness * 1.5,
          boardHeight - frameThickness * 1.5,
          corkDepth,
        ]}
        position={[0, 0, frameThickness / 2 - corkDepth / 2 + 0.01]} // Positioned inside the frame, slightly forward
        onClick={handleBoardClick}
        onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={corkColor} roughness={0.9} />

        {/* Notes - position them on the Z-surface of the cork */}
        <Note
          position={[-boardWidth * 0.25, boardHeight * 0.15, corkDepth / 2 + 0.005]}
          rotation={[0, 0, THREE.MathUtils.degToRad(10)]}
          color="#FFFACD" // LemonChiffon (yellowish)
        />
        <Note
          position={[boardWidth * 0.2, boardHeight * 0.25, corkDepth / 2 + 0.005]}
          rotation={[0, 0, THREE.MathUtils.degToRad(-8)]}
          color="#ADD8E6" // LightBlue
        />
        <Note
          position={[-boardWidth * 0.1, -boardHeight * 0.2, corkDepth / 2 + 0.005]}
          rotation={[0, 0, THREE.MathUtils.degToRad(5)]}
          color="#90EE90" // LightGreen
        />

        {/* Pins - position them as if holding the notes, slightly in front of notes */}
        {/* Pin for yellow note */}
        <Pin position={[-boardWidth * 0.25 +0.2, boardHeight * 0.15 + 0.2, corkDepth / 2 + 0.015]} color="red" />
        {/* Pin for blue note */}
        <Pin position={[boardWidth * 0.2 - 0.2, boardHeight * 0.25 + 0.2, corkDepth / 2 + 0.015]} color="blue" />
        {/* Pin for green note */}
        <Pin position={[-boardWidth * 0.1 + 0.2, -boardHeight * 0.2 + 0.2, corkDepth / 2 + 0.015]} color="green" />
        {/* Extra pin */}
        <Pin position={[boardWidth * 0.3, -boardHeight * 0.3, corkDepth / 2 + 0.015]} color="yellow" />
      </Box>
    </group>
  );
}

export default BulletinBoard;