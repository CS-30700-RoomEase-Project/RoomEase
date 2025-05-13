// // src/components/Pages/Room/Room Items/GavelPad.js
// import React from "react";
// import "./gavel-pad.css";

// export default function GavelPad({ onClick }) {
//   return (
//     <div className="gavel-pad-container" onClick={onClick}>
//       <div className="gavel-pad-base" />
//       <div className="gavel-pad-top" />
//     </div>
//   );
// }

"use client";
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
    <mesh
      ref={padRef}
      position={position}
      onClick={enabled ? onClick : undefined}
      onPointerOver={() => enabled && setHovered(true)}
      onPointerOut={() => setHovered(false)}
      title={enabled ? "Click Gavel Pad" : ""}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
      <meshStandardMaterial
        color="#3e2f1c"
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

export default GavelPad;
