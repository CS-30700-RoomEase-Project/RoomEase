"use client";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

export default function Clock3D({ enabled = true, onClick, position = [0, 0, 0] }) {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();
  const [roomColor, setRoomColor] = useState("#ffffff");
  const [hovered, setHovered] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function fetchState() {
      if (!userId) return;
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/roomstate/queue/${userId}`);
      if (!res.ok) return;
      const { current } = await res.json();
      if (current?.color) {
        const col = current.color.startsWith("#") ? current.color : `#${current.color}`;
        setRoomColor(col);
      }
    }
    fetchState();
  }, [userId]);

  useFrame(() => {
    const now = new Date();
    const h = now.getHours() % 12;
    const m = now.getMinutes();
    const s = now.getSeconds();

    if (hourRef.current)
      hourRef.current.rotation.z = -THREE.MathUtils.degToRad(h * 30 + m * 0.5);
    if (minuteRef.current)
      minuteRef.current.rotation.z = -THREE.MathUtils.degToRad(m * 6);
    if (secondRef.current)
      secondRef.current.rotation.z = -THREE.MathUtils.degToRad(s * 6);
  });

  // Clock hand geometries, translated to pivot from base
  const hourGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(0.03, 0.25, 0.02);
    g.translate(0, 0.125, 0);
    return g;
  }, []);

  const minuteGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(0.02, 0.35, 0.02);
    g.translate(0, 0.175, 0);
    return g;
  }, []);

  const secondGeom = useMemo(() => {
    const g = new THREE.BoxGeometry(0.01, 0.4, 0.01);
    g.translate(0, 0.2, 0);
    return g;
  }, []);

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Clock Border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.03]}>
        <cylinderGeometry args={[0.63, 0.6, 0.06, 64]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Clock Face */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 64]} />
        <meshStandardMaterial color={hovered ? roomColor : "#ffffff"} />
      </mesh>

      {/* Hour Markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const x = Math.sin(angle) * 0.5;
        const y = Math.cos(angle) * 0.5;
        return (
          <mesh
            key={i}
            position={[x, y, 0.055]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <boxGeometry args={[0.015, 0.05, 0.02]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        );
      })}

      {/* Hour Hand */}
      <mesh ref={hourRef} position={[0, 0, 0.07]}>
        <primitive object={hourGeom} attach="geometry" />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Minute Hand */}
      <mesh ref={minuteRef} position={[0, 0, 0.08]}>
        <primitive object={minuteGeom} attach="geometry" />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Second Hand */}
      <mesh ref={secondRef} position={[0, 0, 0.09]}>
        <primitive object={secondGeom} attach="geometry" />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* Center Dot */}
      <mesh position={[0, 0, 0.1]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
}
