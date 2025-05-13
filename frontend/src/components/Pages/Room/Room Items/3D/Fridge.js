"use client";
import { Html, RoundedBox } from "@react-three/drei";
import React, { useRef, useState } from "react";
import GroceryPopUp from "../../../GroceryPage/GroceryPopUp"; // Assuming this path is correct

function Fridge({
  position: initialPosition = [3, 2, 2], // Adjusted default Y position
  room,
  enabled,
  roomCosmetics,
}) {
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const groupRef = useRef();

  const handleClick = () => {
    if (enabled) {
      setPopUpOpen(true);
    }
  };

  // Define dimensions for clarity and easier adjustments
  const fridgeWidth = 2.2;
  const fridgeHeight = 4.5; // Increased overall height
  const fridgeDepth = 2.0; // Increased depth
  const doorThickness = 0.1;
  const handleThickness = 0.08;
  const handleWidth = 0.08;

  const freezerDoorHeight = fridgeHeight * 0.35; // Freezer is 35% of total height
  const fridgeDoorHeight = fridgeHeight * 0.65; // Main fridge door is 65%

  // Calculate door Z position relative to fridge body
  const doorZOffset = fridgeDepth / 2 + doorThickness / 2 - 0.01; // Slight inset for main body to show

  // Calculate handle Z position relative to door
  const handleZOffset = doorZOffset + handleThickness / 2 + 0.02; // Slightly proud of the door

  const cssColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--fridge-color')
  .trim() || 'white';

  return (
    <group
      position={initialPosition} // Use the prop for overall positioning
      ref={groupRef}
      rotation={[0, Math.PI / 2, 0]} // Keeps original rotation
    >
      {/* Fridge Main Body */}
      <RoundedBox
        args={[fridgeWidth, fridgeHeight, fridgeDepth]}
        radius={0.15} // Slightly larger radius for a softer look on a bigger fridge
        smoothness={5}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={cssColor} // Slightly darker body
          metalness={0.6}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Freezer Door */}
      {/* Position Y: (fridgeHeight / 2) - (freezerDoorHeight / 2) - (gap_if_any) */}
      <mesh
        position={[
          0,
          fridgeHeight / 2 - freezerDoorHeight / 2,
          doorZOffset,
        ]}
        onClick={handleClick}
      >
        <boxGeometry
          args={[fridgeWidth * 0.96, freezerDoorHeight, doorThickness]} // Slightly narrower than body
        />
        <meshStandardMaterial
          color={cssColor} // Lighter door color
          metalness={0.65}
          roughness={0.25}
        />
      </mesh>

      {/* Fridge Door */}
      {/* Position Y: -(fridgeHeight / 2) + (fridgeDoorHeight / 2) + (gap_if_any) */}
      {/* Or more simply: freezerDoorY - (freezerDoorHeight/2) - (fridgeDoorHeight/2) */}
      <mesh
        position={[
          0,
          fridgeHeight / 2 -
            freezerDoorHeight -
            fridgeDoorHeight / 2 +
            0.02, // Small gap between doors
          doorZOffset,
        ]}
        onClick={handleClick}
      >
        <boxGeometry
          args={[fridgeWidth * 0.96, fridgeDoorHeight - 0.02, doorThickness]} // Slightly narrower
        />
        <meshStandardMaterial
          color={cssColor} // Consistent door color
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* Freezer Handle */}
      {/* Position Y will be relative to the freezer door's center */}
      <mesh
        position={[
          fridgeWidth * 0.4, // To the right side
          fridgeHeight / 2 - freezerDoorHeight / 2, // Centered on freezer door
          handleZOffset,
        ]}
      >
        <boxGeometry
          args={[handleWidth, freezerDoorHeight * 0.6, handleThickness]} // Proportional handle
        />
        <meshStandardMaterial
          color="#3c3c3e"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Fridge Handle */}
      {/* Position Y will be relative to the fridge door's center */}
      <mesh
        position={[
          fridgeWidth * 0.4, // To the right side
          fridgeHeight / 2 -
            freezerDoorHeight -
            fridgeDoorHeight / 2 +
            0.02, // Centered on fridge door
          handleZOffset,
        ]}
      >
        <boxGeometry
          args={[handleWidth, fridgeDoorHeight * 0.7, handleThickness]} // Proportional handle
        />
        <meshStandardMaterial
          color="#3c3c3e"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Optional Fridge Letters */}
      {/* Position on the upper part of the freezer door */}
      {roomCosmetics?.activeDecorations?.["Fridge Letters"] && (
        <Html
          position={[
            -fridgeWidth * 0.35, // Adjust X to be on the left side of the freezer
            fridgeHeight / 2 - freezerDoorHeight * 0.2, // Upper part of the freezer door
            doorZOffset + doorThickness / 2 + 0.01, // Slightly in front of the freezer door
          ]}
          center
        >
          <div
            style={{
              fontSize: "20px", // Slightly larger font for a bigger fridge
              fontWeight: "bold",
              color: "black",
              userSelect: "none", // Prevent text selection
            }}
          >
            ABC
          </div>
        </Html>
      )}

      {/* Grocery Popup UI */}
      {isPopUpOpen && (
        <Html center>
          <GroceryPopUp
            room={room}
            isOpen={isPopUpOpen}
            onClose={() => setPopUpOpen(false)}
          />
        </Html>
      )}
    </group>
  );
}

export default Fridge;