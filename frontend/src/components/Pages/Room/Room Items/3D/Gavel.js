"use client";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function Gavel({ position = [0, 1, 0], enabled, onClick }) {
  const gavelRef = useRef();
  const swingRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [swinging, setSwinging] = useState(false);
  const cssColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--gavel-color')
  .trim() || '#FFD700';
  // Base tilt resting rotation
  const baseRotation = [0.3, 0.2, Math.PI / 4];

  useFrame((_, delta) => {
    if (!gavelRef.current) return;

    if (swinging) {
      swingRef.current += delta * 8;
      const swingAngle = Math.sin(swingRef.current) * 0.6;

      gavelRef.current.rotation.x = baseRotation[0] + swingAngle;
      gavelRef.current.rotation.y = baseRotation[1];
      gavelRef.current.rotation.z = baseRotation[2];

      if (swingRef.current > Math.PI) {
        swingRef.current = 0;
        setSwinging(false);
        gavelRef.current.rotation.x = baseRotation[0];
      }
    }
  });

  const handleHover = () => {
    if (enabled && !swinging) {
      setSwinging(true);
    }
  };

  return (
    <group
      ref={gavelRef}
      position={position}
      onClick={onClick}
      onPointerEnter={handleHover}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* === Gavel Head === */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 20]} />
        <meshStandardMaterial color={cssColor} />
      </mesh>

      {/* === End Caps === */}
      <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 20]} />
        <meshStandardMaterial color="#b89068" />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 20]} />
        <meshStandardMaterial color="#b89068" />
      </mesh>

      {/* === Handle === */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial color="#c7a079" />
      </mesh>

      {/* === Centered Invisible Hitbox (Final Fix) === */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

export function GavelPad({ position = [0, 0, 0], onClick }) {
  return (
    <mesh position={position} onClick={onClick}>
      <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
      <meshStandardMaterial color="#2e2e2e" roughness={0.5} />
    </mesh>
  );
}

export default Gavel;
