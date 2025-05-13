import { Box, Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import GavelPad from "./GavelPad";

function Desk({ gavelVisible, computer, onGavelPadClick, children, position = [0, 0, 0] }) {
  const deskRef = useRef();

  // Chair material created with useMemo (only once)
  const chairMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#5a3410", roughness: 0.6 }),
    []
  );

  return (
    <group ref={deskRef} position={position}>
      {/* === Desk Surface === */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[4, 0.2, 2]} />
        <meshStandardMaterial color="#8b5a2b" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* === Drawers (Left + Right) === */}
      <mesh position={[-1.4, 0.8, 0]}>
        <boxGeometry args={[1, 1.6, 1.8]} />
        <meshStandardMaterial color="#71797E," metalness={0.6} />
      </mesh>
      <mesh position={[1.4, 0.8, 0]}>
        <boxGeometry args={[1, 1.6, 1.8]} />
        <meshStandardMaterial color="#71797E," metalness={0.6} />
      </mesh>

      {/* === Drawer Handles === */}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={`lh-${i}`} position={[-1.4, 0.9 + y, 0.9]}>
          <boxGeometry args={[0.5, 0.05, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
      {[0.5, 0, -0.5].map((y, i) => (
        <mesh key={`rh-${i}`} position={[1.4, 0.9 + y, 0.9]}>
          <boxGeometry args={[0.5, 0.05, 0.1]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}

      {/* === Legs === */}
      {/* <mesh position={[-1.4, 0.2, -0.8]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#5a3410" />
      </mesh>
      <mesh position={[1.4, 0.2, -0.8]}>
        <boxGeometry args={[0.8, 0.8, 0.6]} />
        <meshStandardMaterial color="#5a3410" />
      </mesh> */}

      {/* === Chair (Tucked In) === */}
      <Chair position={[0, 0, 1]} rotation={[0, Math.PI, 0]} material={chairMaterial} />

      {/* === Computer === */}
      {computer && <group position={[-0.5, 1.9, 0]}>{computer}</group>}

      {/* === Gavel Area === */}
      {gavelVisible && (
        <group position={[1.2, 1.84, 0.5]}>
          {children}
          <Html position={[0, -0.05, 0]} center />
          <GavelPad onClick={onGavelPadClick} />
        </group>
      )}
    </group>
  );
}

const Chair = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = [1.9, 1.9, 1.9], 
  material 
}) => {
  const seatHeight = 0.45;
  const legHeight = 0.5;
  const backHeight = 0.8;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Seat */}
      <Box 
        args={[0.5, 0.1, 0.5]} 
        position={[0, legHeight + 0.05, 0]} 
        material={material} 
        castShadow 
      />

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

export default Desk;

