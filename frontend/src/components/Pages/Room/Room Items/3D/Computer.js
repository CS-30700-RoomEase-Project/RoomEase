// "use client"
// import { useNavigate } from "react-router-dom"
// import BillsIcon from "./ComputerContent/BillIcon/BillsIcon"
// import InviteIcon from "./ComputerContent/InviteIcon/InviteIcon"
// import RoomSettingsIcon from "./ComputerContent/SettingsIcon/RoomSettingsIcon"
// import "./computer.css"

// function Computer({ handleInviteClick, handleSettingsClick, roomId, roomData }) {
//   const navigate = useNavigate()

//   const awardQuestPoints = async (userId, roomId, questType) => {
//     try {
//         const response = await fetch('http://localhost:5001/api/room/award-quest-points', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json', // Ensures the body is JSON
//             },
//             body: JSON.stringify({
//                 userId,
//                 roomId,
//                 questType
//             }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//             console.log('Points awarded:', result.message);
//         } else {
//             console.error('Error:', result.message);
//         }
//     } catch (error) {
//         console.error('Error calling API:', error);
//     }
//   };

//   const handleGoToBills = () => {
//     const storedUser = localStorage.getItem("userData");
//     const parsedUser = JSON.parse(storedUser);
//     const currentUserId = parsedUser._id;
//     awardQuestPoints(currentUserId, roomId, "checkBills");
//     navigate(`/room/${roomId}/bills`)
//   }

//   return (
//     <div className="computer-container">
//       <div className="monitor">
//         <div className="monitor-frame">
//           <div className="monitor-screen">
//             <div className="screen-content">
//               {roomId !== "master-room" && <RoomSettingsIcon onClick={handleSettingsClick} />}
//               {roomId !== "master-room" && <InviteIcon onClick={handleInviteClick} />}
//               {/* {(roomId === "master-room" || roomData.settings[1]) && <BillsIcon onClick={handleGoToBills} />} */}
//               {(roomId === "master-room" || roomData?.settings?.[1]) && <BillsIcon onClick={handleGoToBills} />}
//             </div>
//           </div>
//           <div className="monitor-logo"></div>
//         </div>
//         <div className="monitor-stand">
//           <div className="stand-neck"></div>
//           <div className="stand-base"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Computer

"use client";
import { Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BillsIcon from "../ComputerContent/BillIcon/BillsIcon";
import InviteIcon from "../ComputerContent/InviteIcon/InviteIcon";
import RoomSettingsIcon from "../ComputerContent/SettingsIcon/RoomSettingsIcon";

function Computer({ handleInviteClick, handleSettingsClick, roomId, roomData, position = [0, 0, 0] }) {
  const navigate = useNavigate();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null); // "settings", "invite", "bills", or null

  const awardQuestPoints = async (userId, roomId, questType) => {
    try {
      const response = await fetch('http://localhost:5001/api/room/award-quest-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roomId, questType }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Points awarded:', result.message);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const handleGoToBills = () => {
    const storedUser = localStorage.getItem("userData");
    const parsedUser = JSON.parse(storedUser);
    const currentUserId = parsedUser._id;
    awardQuestPoints(currentUserId, roomId, "checkBills");
    navigate(`/room/${roomId}/bills`);
  };

  return (
    <group position={position} ref={groupRef}>
      {/* Monitor Frame */}
      <mesh
        position={[0, 1, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 1.3, 0.15]} />
        <meshStandardMaterial color={hovered ? "#4d4d4d" : "#2b2b2b"} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Screen Display */}
      {/* <mesh position={[0, 1.3, 0.081]}>
        <boxGeometry args={[2.5, 1.5, 0.01]} />
        <meshStandardMaterial color="black" />
      </mesh> */}

      {/* HTML UI on Screen */}
      <Html position={[0, 1, 0.09]} center transform occlude>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            padding: "6px 10px",
            justifyContent: "center",
            alignItems: "center",
            // background: "rgba(0, 0, 0, 0.3)",
            borderRadius: "8px",
            width: "auto",
            transform: "scale(0.5)",
            position: "relative",
          }}
        >
          {roomId !== "master-room" && (
            <div
              onMouseEnter={() => setHoveredIcon("settings")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ position: "relative" }}
            >
              <RoomSettingsIcon onClick={handleSettingsClick} />
              {hoveredIcon === "settings" && (
                <div style={{
                  background: 'black',
                  color: 'white',
                  padding: '8px',
                  fontSize: '16px',
                  zIndex: 1000,
                  borderRadius: '4px',
                }}>Settings</div>
              )}
            </div>
          )}

          {roomId !== "master-room" && (
            <div
              onMouseEnter={() => setHoveredIcon("invite")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ position: "relative" }}
            >
              <InviteIcon onClick={handleInviteClick} />
              {hoveredIcon === "invite" && (
                <div style={{
                  background: 'black',
                  color: 'white',
                  padding: '8px',
                  fontSize: '16px',
                  zIndex: 1000,
                  borderRadius: '4px',
                }}>Invite</div>
              )}
            </div>
          )}

          {(roomId === "master-room" || roomData?.settings?.[1]) && (
            <div
              onMouseEnter={() => setHoveredIcon("bills")}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{ position: "relative" }}
            >
              <BillsIcon onClick={handleGoToBills} />
              {hoveredIcon === "bills" && (
                <div style={{
                  background: 'black',
                  color: 'white',
                  padding: '8px',
                  fontSize: '16px',
                  zIndex: 1000,
                  borderRadius: '4px',
                }}>Bills</div>
              )}
            </div>
          )}
        </div>
      </Html>


      {/* Monitor Logo */}
      <mesh position={[0, 0.7, 0.076]}>
        <boxGeometry args={[0.3, 0.05, 0.01]} />
        <meshStandardMaterial color="#999" />
      </mesh>

      {/* Monitor Neck */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Stand Base */}
      <mesh position={[0, -.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

export default Computer;
