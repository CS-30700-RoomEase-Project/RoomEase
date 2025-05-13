// "use client"
// import Broom from "./Broom"
// import "./chore-items.css"
// import TrashCan from "./TrashCan"

// const ChoreItems = ({ onClick, enabled }) => {
//   return (
//     <div
//       className="chore-items-container"
//       onClick={onClick}
//       title={enabled ? "Chores" : ""}
//       style={{
//         cursor: enabled ? "pointer" : "default",
//         pointerEvents: enabled ? "auto" : "none",
//       }}
//     >
//       <TrashCan />
//       <Broom />
//     </div>
//   )
// }

// export default ChoreItems


// ChoreItems3D.jsx
"use client";

import { useCursor } from '@react-three/drei';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import Broom from './Broom'; // Adjust path as needed
import TrashCan from './TrashCan'; // Adjust path as needed

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
      event.stopPropagation(); // Prevent click from bubbling to other scene elements
      onClick(event);
    }
  };

  // Relative positions for items within the group
  const trashCanPosition = [-0.35, 0, 0]; // Trash can slightly to the left
  const broomPosition = [0.3, -0.2, 0.05];  // Broom to the right, slightly back, and base lower
  const broomRotation = [0, THREE.MathUtils.degToRad(-15), THREE.MathUtils.degToRad(15)]; // Lean broom

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
      <TrashCan position={trashCanPosition} />
      {/*
        Adjusting broom position:
        The broom's own origin is at the center of its bristle base.
        If trash can base is at y=0 locally (its origin is center of its base cylinder),
        and broom base should also be near y=0 locally.
        The broom's height is approx handleHeight + connectorHeight + headHeight + bristleLength.
        Its internal origin is at the bottom center of the bristles.
      */}
      <Broom
        position={[
            broomPosition[0]+.45,
            // -(1.2 + 0.08 + 0.1 + 0.25)/2 + 0.25/2 + 0.1, // Adjust Y to make broom base align roughly with trashcan base.
            -.74,
            broomPosition[2]
        ]}
        rotation={broomRotation}
        scale={1.8} // Broom slightly smaller scale
      />
    </group>
  );
};

export default ChoreItems;