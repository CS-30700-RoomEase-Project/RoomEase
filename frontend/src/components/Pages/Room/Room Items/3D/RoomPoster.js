"use client";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const RoomPoster = ({ roomId, position = [0, 0, 0], size = [2.4, 1.7] }) => {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { gl } = useThree();

  useEffect(() => {
    const fetchRoomImage = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/room/roomImage/${roomId}`);
        if (!res.ok) return console.warn("No image found for room", roomId);
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImageUrl(blobUrl);
      } catch (err) {
        console.error("Failed to fetch image:", err);
      }
    };

    fetchRoomImage();
  }, [roomId]);

  useEffect(() => {
    if (!imageUrl) return;

    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        setTexture(tex);
      },
      undefined,
      (err) => console.error("Texture load failed:", err)
    );
  }, [imageUrl]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(size[0], size[1]), [size]);

  if (!texture) return null;

  return (
    <group position={position}>
      {/* Optional border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[size[0] + 0.05, size[1] + 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Image Poster */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default RoomPoster;
