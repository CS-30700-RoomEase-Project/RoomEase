import { Html, OrbitControls, Plane, Text } from "@react-three/drei";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as THREE from "three";
import Avatar from "../../Shared_components/AvatarButton/AvatarButton";
import GroupChat from "../../Shared_components/Messages/GroupChat";
import RateButton from "../../Shared_components/RoomRating/RateButton";
import BulletinBoard from "./Room Items/3D/BulletinBoard";
import Clock from "./Room Items/3D/Clock";
import Computer from "./Room Items/3D/Computer";
import Desk from "./Room Items/3D/Desk";
import Fridge from "./Room Items/3D/Fridge";
import Gavel from "./Room Items/3D/Gavel";
// import Puppy from "./Room Items/PuppyCosmetic/Puppy";
import BulletinPopup from "../../Shared_components/BulletinPopup/BulletinPopup";
import NotesPopup from "../../Shared_components/BulletinPopup/NotesPopup";
import LeaderboardPopup from "../../Shared_components/LeaderboardPopup/LeaderboardPopup";
// import QuestBell from "../../Shared_components/QuestBell/QuestBell";
import QuestBoard from "../../Shared_components/QuestBell/QuestBoard";
import RoomSettingsPopup from "../../Shared_components/RoomSettings/RoomSettingsPopup";
import CosmeticStorePopup from "./CosmeticStorePopup";
import ChoreItems from "./Room Items/3D/ChoreItems";
import DiningTable from "./Room Items/3D/DiningTable";
import RoomPoster from "./Room Items/3D/RoomPoster";
import "./Room.css";
import tileImg from "./carpet.png";
import tileImg2 from "./carpet2.png";
import tileImg3 from "./fancycarpet.png";

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [showBulletin, setShowBulletin] = useState(false);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setusername] = useState(null);
  const [cosmetics, setCosmetics] = useState(null);
  const [cosmeticPopupOpen, setCosmeticPopupOpen] = useState(false);
  const [cosmeticData, setCosmeticData] = useState({});
  const [points, setPoints] = useState(0);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const hasCheckedWrapped = useRef(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setusername(userData?.username);

    if (!userData?.userId) {
      navigate("/login");
      return;
    }

    const checkWrapped = async () => {
      if (hasCheckedWrapped.current) {
        return;
      }
      hasCheckedWrapped.current = true;
      try {
        const response = await fetch(`http://localhost:5001/api/room/${roomId}/check-wrapped`, {
          method: 'POST',
        });
    
        const data = await response.json();
        if (response.ok) {
          console.log('Wrapped check result:', data);
          // You can trigger UI updates or alerts here if needed
        } else {
          console.error('Error from server:', data.message);
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    }
    

    const fetchRoomData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/room/getRoom?roomId=${roomId}&userId=${userData.userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("roommates", "");
        localStorage.setItem(
          "roommates",
          JSON.stringify(data.room.roomMembers)
        );
        console.log("roomData:", data);
        setRoomData(data.room);
        console.log("roomData2:", roomData);
        const storedUser = localStorage.getItem("userData");
        const parsedUser = JSON.parse(storedUser);
        const currentUserId = parsedUser._id;
        console.log(currentUserId);
        setPoints(data.room.points[currentUserId]);
        console.log("points:", points);
        setLoading(false);
        localStorage.setItem("roomData", JSON.stringify(data.room));
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchCosmetics = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/room/getCosmetic?roomId=${roomId}&userId=${userData.userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`Cosmetic fetch error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.cosmetic);
        await setCosmeticData(data.cosmetic);
        console.log("Fetched cosmetics:", data.cosmetic);
        console.log("cosmeticData:", cosmeticData);
      } catch (err) {
        console.error("Error fetching cosmetics:", err);
      }
    };
    checkWrapped();
    fetchRoomData();
    fetchCosmetics();
    
  }, [roomId, navigate]);

  useEffect(() => {
    if (!cosmeticData || !Array.isArray(cosmeticData.selected)) return;

    const applyRoomColors = (selectedArray) => {
      const keys = [
        "fridge",
        "table",
        "computer",
        "trash",
        "board",
        "clock",
        "gavel",
        "background",
      ];

      keys.forEach((key, i) => {
        const color = selectedArray[i];
        if (color && color !== "default") {
          document.documentElement.style.setProperty(`--${key}-color`, color);
        } else {
          document.documentElement.style.removeProperty(`--${key}-color`);
        }
      });
    };

    applyRoomColors(cosmeticData.selected);
  }, [cosmeticData]);

  const handlePurchase = async (color) => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    try {
      const response = await fetch(
        "http://localhost:5001/api/room/purchaseColor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData._id,
            roomId,
            color,
          }),
        }
      );

      if (!response.ok) throw new Error("Purchase failed");

      const updated = await response.json();
      setCosmeticData(updated.cosmetic);
      setPoints(updated.totalPoints);
    } catch (err) {
      console.error(err);
      alert("Not enough points or purchase failed");
    }
  };

  const handleSelect = async (index, color) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(color);
    console.log(index);

    try {
      const response = await fetch(
        "http://localhost:5001/api/room/selectColor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData._id,
            roomId,
            index,
            color,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to select color");

      const updated = await response.json();
      setCosmeticData(updated.cosmetic);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchaseDecoration = async (decoration) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await fetch(
        "http://localhost:5001/api/room/purchaseDecoration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData._id, roomId, decoration }),
        }
      );
      if (!response.ok) throw new Error("Purchase decoration failed");
      const updated = await response.json();
      setCosmeticData(updated.cosmetic);
      setPoints(updated.totalPoints);
    } catch (err) {
      console.error(err);
      alert("Not enough points or purchase failed");
    }
  };

  const handleToggleDecoration = async (decoration, newState) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
      const response = await fetch(
        "http://localhost:5001/api/room/toggleDecoration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userData._id,
            roomId,
            decoration,
            enabled: newState,
          }),
        }
      );
      if (!response.ok) throw new Error("Toggle decoration failed");
      const updated = await response.json();
      setCosmeticData(updated.cosmetic);
    } catch (err) {
      console.error(err);
      alert("Toggling decoration failed");
    }
  };


  const handleSettingsClick = () => {
    setShowSettingsPopup(true);
  };



  const handleBulletinClick = () => {
    if (roomData.settings[3] || roomData.settings[9] || roomData.settings[8]) {
      setShowBulletin(true);
    } else {
      return;
    }
  };

  const awardQuestPoints = async (userId, roomId, questType) => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/room/award-quest-points",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensures the body is JSON
          },
          body: JSON.stringify({
            userId,
            roomId,
            questType,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Points awarded:", result.message);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const ROOM_WIDTH = 20;
  const ROOM_DEPTH = 20;
  const ROOM_HEIGHT = 10;
  
  // return (
  //   <>
  //     <div className="appContainer">
  //       <div className="roomBanner">
          // <ExitRoom
          //   onClick={() => navigate("/dashboard")}
          //   style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          // />
          // <QuestBell></QuestBell>
          // <RoomLeaderboardPopup room={roomData} /> 
          // <h1 className="roomTitle">{roomData.roomName}</h1> 
          // <div className="roomBannerMini">
          // <button
          //     aria-label="Open Cosmetic Store"
          //     onClick={() => setCosmeticPopupOpen(true)}
          //   >
          //     <svg
          //       xmlns="http://www.w3.org/2000/svg"
          //       width="24"
          //       height="24"
          //       viewBox="0 0 24 24"
          //       fill="none"
          //       stroke="currentColor"
          //       strokeWidth="2"
          //       strokeLinecap="round"
          //       strokeLinejoin="round"
          //     >
          //       <path d="M6 7h12l1 13H5L6 7z" />
          //       <path d="M9 7V5a3 3 0 0 1 6 0v2" />
          //     </svg>
          //   </button>

          //   <button
          //     aria-label="Open Wrapped / Leaderboard"
          //     onClick={() => setLeaderboardOpen(true)}
          //   >

          //   <svg
          //     xmlns="http://www.w3.org/2000/svg"
          //     width="24"
          //     height="24"
          //     viewBox="0 0 24 24"
          //     fill="none"
          //     stroke="currentColor"
          //     strokeWidth="2"
          //     strokeLinecap="round"
          //     strokeLinejoin="round"
          //   >
          //     <path d="M3 21h18" />
          //     <rect x="6"  y="11" width="3" height="10" rx="1" />
          //     <rect x="11" y="6"  width="3" height="15" rx="1" />
          //     <rect x="16" y="14" width="3" height="7"  rx="1" />
          //   </svg>

          //   </button>

          //   {roomData.settings[7] && (
          //     <RateButton style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
          //   )}
          //   {roomData.settings[6] && (
          //     <GroupChat
          //       roomId={roomId}
          //       userName={username}
          //       style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          //     />
          //   )}
          //   <Avatar style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
          // </div>
  //       </div>
  //       <BulletinPopup
  //         isOpen={showBulletin}
  //         onClose={() => setShowBulletin(false)}
  //         settings={[
  //           roomData.settings[3],
  //           roomData.settings[9],
  //           roomData.settings[8],
  //         ]}
  //         roomId={roomId}
  //         onOpenNotes={() => setShowNotesPopup(true)}
  //       />
  //       <NotesPopup
  //         room={roomData}
  //         isOpen={showNotesPopup}
  //         onClose={() => setShowNotesPopup(false)}
  //         initialNotes={roomData.bulletinNotes}
  //       />

  //       <div className="roomBackground">
  //         <div className="upperSection">
  //           <div className="upperLeft"></div>
  //           <div className="upperMiddle">
  //             <div className="hover-container">
  //               <BulletinBoard
  //                 onClick={handleBulletinClick}
  //                 enabled={
  //                   roomData.settings[3] ||
  //                   roomData.settings[9] ||
  //                   roomData.settings[8]
  //                 }
  //                 style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //               />
  //               <span className="hover-label">
  //                 Quiet Hours, Room Notes, Room Clauses
  //               </span>
  //             </div>
  //           </div>
  //           <div className="upperRight">
  //             <div className="hover-container">
  //               <Clock
  //                 onClick={() => handleGoToState(roomId)}
  //                 enabled={roomData.settings[4]}
  //                 style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //               />
  //               <span className="hover-label">Room State</span>
  //             </div>
  //           </div>
  //         </div>

  //         <div className="floorItems">
  //           <div className="floorLeft">
  //             <div className="hover-container">
  //               <Fridge
  //                 room={roomData}
  //                 enabled={roomData.settings[0]}
  //                 style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //                 roomCosmetics={cosmeticData}
  //               />
  //               <span className="hover-label">Grocries</span>
  //             </div>
  //           </div>
  //           <div className="floorMiddle">
  //             <Desk
  //               gavelVisible={true}
  //               computer={
  //                 <div className="hover-container">
  //                   <Computer
  //                     handleInviteClick={handleInviteClick}
  //                     handleSettingsClick={handleSettingsClick}
  //                     roomId={roomData._id}
  //                     roomData={roomData}
  //                     style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //                   />
  //                   <span className="hover-label">
  //                     Settings, Invites, Bills
  //                   </span>
  //                 </div>
  //               }
  //               onGavelPadClick={goToSubmitDispute}
  //               style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //             >
  //               <div className="hover-container">
  //                 <Gavel
  //                   onClick={() => handleGoToDisputes(roomId)}
  //                   enabled={roomData.settings[2]}
  //                   style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //                 />
  //                 <span className="hover-label">Disputes</span>
  //               </div>
  //             </Desk>
  //           </div>

  //           <div className="floorRight">
  //             <Puppy visible={cosmeticData.activeDecorations?.["Puppy"]} />
  //             <div className="hover-container">
  //               <ChoreItems
  //                 onClick={() => handleGoToChores(roomId)}
  //                 enabled={roomData.settings[5]}
  //                 style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
  //               />
  //               <span className="hover-label">Chores</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div className="roomFloor" />
  //     </div>

      // <BulletinPopup
      //   isOpen={showBulletin}
      //   onClose={() => setShowBulletin(false)}
      //   settings={[
      //     roomData.settings[3],
      //     roomData.settings[9],
      //     roomData.settings[8],
      //   ]}
      //   roomId={roomId}
      //   onOpenNotes={() => setShowNotesPopup(true)}
      //   style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      // />

      // <NotesPopup
      //   room={roomData}
      //   isOpen={showNotesPopup}
      //   onClose={() => setShowNotesPopup(false)}
      //   initialNotes={roomData.bulletinNotes}
      //   style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      // />
      // <RoomSettingsPopup
      //   isOpen={showSettingsPopup}
      //   onClose={() => setShowSettingsPopup(false)}
      // />
      // <CosmeticStorePopup
      //   isOpen={cosmeticPopupOpen}
      //   onClose={() => setCosmeticPopupOpen(false)}
      //   cosmetics={cosmeticData}
      //   totalPoints={points}
      //   onPurchase={handlePurchase}
      //   onSelect={handleSelect}
      //   onPurchaseDecoration={handlePurchaseDecoration}
      //   onToggleDecoration={handleToggleDecoration}
      // />
      // <LeaderboardPopup
      //   isOpen={leaderboardOpen}
      //   onClose={() => setLeaderboardOpen(false)}
      // />
    // </>
  // );
  return (
    <>
      <div className="appContainer">
        {/* Nav bar and banner remain untouched */}
        <div className="roomBanner">
          {/* <h1 className="roomTitle">{roomData.roomName}</h1> */}
          {/* Buttons like ExitRoom, QuestBell, GroupChat, etc. remain here */}
          {/* <RoomLeaderboardPopup room={roomData} />  */}
          <h1 className="roomTitle">{roomData.roomName}</h1> 
          <div className="roomBannerMini">
          <button
              aria-label="Open Cosmetic Store"
              onClick={() => setCosmeticPopupOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 7h12l1 13H5L6 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
            </button>

            <button
              aria-label="Open Wrapped / Leaderboard"
              onClick={() => setLeaderboardOpen(true)}
            >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <rect x="6"  y="11" width="3" height="10" rx="1" />
              <rect x="11" y="6"  width="3" height="15" rx="1" />
              <rect x="16" y="14" width="3" height="7"  rx="1" />
            </svg>

            </button>

            {roomData.settings[7] && (
              <RateButton style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
            )}
            {roomData.settings[6] && (
              <GroupChat
                roomId={roomId}
                userName={username}
                style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
              />
            )}
            <Avatar style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
          </div>
        </div>

        {/* ===== 3D Room Canvas Section ===== */}
        <div className="canvasWrapper">
          <Canvas camera={{ position: [2, 8, 11], fov: 55 }}>
            <ambientLight intensity={0.3} />
            <spotLight
              position={[10, 15, 10]}
              angle={0.4}
              penumbra={1}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <RoomScene roomData={roomData} handleBulletinClick={handleBulletinClick} roomId={roomId} handleSettingsClick={handleSettingsClick}/>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              maxDistance={20}
              minDistance={5}
            />

          </Canvas>
        </div>

        {/* === React Popups remain unchanged === */}
        {/* These can render over the 3D room as usual */}
      </div>
      
      {/* === Bulletin & Notes Popups === */}
      {/* Add your BulletinPopup, NotesPopup, CosmeticStorePopup, etc. here */}
      <BulletinPopup
        isOpen={showBulletin}
        onClose={() => setShowBulletin(false)}
        settings={[
          roomData.settings[3],
          roomData.settings[9],
          roomData.settings[8],
        ]}
        roomId={roomId}
        onOpenNotes={() => setShowNotesPopup(true)}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      />

      <NotesPopup
        room={roomData}
        isOpen={showNotesPopup}
        onClose={() => setShowNotesPopup(false)}
        initialNotes={roomData.bulletinNotes}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
      />
      <RoomSettingsPopup
        isOpen={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
      />
      <CosmeticStorePopup
        isOpen={cosmeticPopupOpen}
        onClose={() => setCosmeticPopupOpen(false)}
        cosmetics={cosmeticData}
        totalPoints={points}
        onPurchase={handlePurchase}
        onSelect={handleSelect}
        onPurchaseDecoration={handlePurchaseDecoration}
        onToggleDecoration={handleToggleDecoration}
      />
      <LeaderboardPopup
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
      />
    </>
  );
}

function StarField({ count = 1000 }) {
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2000; // random position in space
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [count]);

  const starMaterial = useMemo(
    () => new THREE.PointsMaterial({ color: 0xffffff, size: 2 }),
    []
  );

  return <points geometry={starsGeometry} material={starMaterial} />;
}

function RoomScene(
  { roomData, cosmeticData, handleBulletinClick, handleSettingsClick, setCosmeticData, setPoints, points, roomId } = {} // Pass props if needed
) {
  const { scene } = useThree();
  const navigate = useNavigate();
  const cssColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--background-color')
  .trim() || '#9591b5';
  const cssColor2 = getComputedStyle(document.documentElement)
  .getPropertyValue('--table-color')
  .trim() || '#c9ced2';
  const [hoveredComponent, setHoveredComponent] = useState(null);

  useEffect(() => {
    // Dark space-like background
    scene.background = new THREE.Color("#000");
  }, [scene]);

    const handleGoToDisputes = (roomId) => {
      if (roomData.settings[2]) {
        console.log("Navigating to disputes with roomId:", roomId);
        navigate(`/disputes/${roomId}`);
      }
    };
  const handleGoToChores = (roomId) => {
    console.log("Navigating to chores with roomId:", roomId);
    navigate(`/chores/${roomId}`);
  };

  const handleInviteClick = () => {
    navigate(`/room/${roomId}/invite`);
  };

  const goToSubmitDispute = () => {
    if (roomData.settings[2]) {
      console.log("Navigating to submit dispute with roomId:", roomId);
      navigate(`/submit-dispute/${roomId}`);
    }
  };

  const handleGoToState = (roomId) => {
    console.log("Navigating to state with roomId:", roomId);
    navigate(`/room-state/${roomId}`);
  };
  const texture = useLoader(THREE.TextureLoader, tileImg);
  const texture2 = useLoader(THREE.TextureLoader, tileImg2);
  const texture3 = useLoader(THREE.TextureLoader, tileImg3);
 

  return (
    <group>
      {/* === Lighting === */}
      <ambientLight intensity={1} />
      <StarField count={2000} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* === Floor === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <Plane args={[10, 10]}>
          <meshStandardMaterial
            color="grey"
            roughness={0.8}
            metalness={0.1}
            side={THREE.DoubleSide}
            // map={texture2}
          />
        </Plane>
      </mesh>

      {/* === Back Wall === */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <Plane args={[10, 5]}>
          <meshStandardMaterial
            color={cssColor}
            roughness={0.8}
            metalness={0.1}
            side={THREE.DoubleSide}
            map={texture}
          />
        </Plane>
      </mesh>

      {/* === Left Wall === */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <Plane args={[10, 5]}>
          <meshStandardMaterial
            color={cssColor}
            roughness={0.8}
            metalness={0.1}
            side={THREE.DoubleSide}
            map={texture}
          />
        </Plane>
      </mesh>

      <mesh
        position={[3.8, 1.8, -4.9]} // right wall
        rotation={[0, 0, 0]}
        onClick={() => navigate("/dashboard")}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.8, 3.6, 0.1]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <Text
        position={[3.8, 4, -4.83]} // slightly in front of door
        rotation={[0, 0, 0]}
        fontSize={0.5}
        color="maroon"
        anchorX="center"
        anchorY="middle"
      >
        EXIT
      </Text>

      {/* === Colorful Carpet === */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.02, 1]} receiveShadow>
        <planeGeometry args={[7, 7]} />
        <meshStandardMaterial
        color={cssColor2}
        roughness={0.8}
        metalness={0.1}
        side={THREE.DoubleSide}
        map={texture2}
      />
      </mesh>
      {/* === Placeholder components === */}
      {/* <Html position={[-4, 1, 0]}>Clock</Html> */}
      <group onPointerOver={() => setHoveredComponent("Fridge")} onPointerOut={() => setHoveredComponent(null)}>
        <Fridge position={[-3.9, 2.26, 2]} room={roomData} enabled={roomData.settings[0]} roomCosmetics={cosmeticData} />
        {hoveredComponent === "Fridge" && <Html position={[-3.9, 3.4, 2]}><div className="tooltip" style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>Grocries</div></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Bulletin Board")} onPointerOut={() => setHoveredComponent(null)}>
        <BulletinBoard enabled={true} onClick={handleBulletinClick} position={[-4.9, 3.5, -2]} rotation={[0, Math.PI/2, 0]} scale={1} />
        {hoveredComponent === "Bulletin Board" && <Html position={[-4.7, 4.4, -2]}><div className="tooltip" style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>Bulletin Board</div></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Chore Bin")} onPointerOut={() => setHoveredComponent(null)}>
        <ChoreItems onClick={() => navigate(`/chores/${roomId}`)} enabled={roomData.settings[5]} position={[-3.8, 0.65, -4]} scale={0.8} />
        {hoveredComponent === "Chore Bin" && <Html position={[-3.8, 1.6, -4]}><div className="tooltip" style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>Chores</div></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Dining Table")} onPointerOut={() => setHoveredComponent(null)}>
        <DiningTable position={[2.3, 0, 1.7]} scale={2} rotation={[0,Math.PI/2,0]} />
        {hoveredComponent === "Dining Table" && <Html position={[1.6, 1.2, 1.8]}></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Desk")} onPointerOut={() => setHoveredComponent(null)}>
        <Desk gavelVisible={true} onGavelPadClick={() => navigate(`/submit-dispute/${roomId}`)} position={[0, 0.05, -3.95]}
          computer={<Computer roomId={roomId} roomData={roomData} handleInviteClick={() => navigate(`/room/${roomId}/invite`)} handleSettingsClick={handleSettingsClick} />}
        />
        {hoveredComponent === "Desk" && <Html position={[0, 1.3, -3.95]}></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Room State Clock")} onPointerOut={() => setHoveredComponent(null)}>
        <Clock position={[-3, 4, -4.9]} onClick={() => handleGoToState(roomId)} />
        {hoveredComponent === "Room State Clock" && <Html position={[-3, 5, -4.9]}><div className="tooltip" style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>Room State</div></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Room Poster")} onPointerOut={() => setHoveredComponent(null)}>
        <RoomPoster roomId={roomId} position={[0, 4, -4.94]} />
        {hoveredComponent === "Room Poster" && <Html position={[0, 5.1, -4.94]}></Html>}
      </group>

      <group onPointerOver={() => setHoveredComponent("Submit a Dispute")} onPointerOut={() => setHoveredComponent(null)}>
        <Gavel
          position={[1.2, 2.8, -3.7]}
          onClick={() => handleGoToDisputes(roomId)}
          enabled={roomData.settings[2]}
          scale={0.8}
        />

        {hoveredComponent === "Submit a Dispute" && <Html position={[1.2, 3.6, -3.7]}>
          <div className="tooltip" style={{
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            whiteSpace: "nowrap"
          }}>Go to Disputes
          </div>
        </Html>}
      </group>

      <QuestBoard position={[2.2, 1.7, 2.5]} rotation={[-Math.PI/2,0,0]}> </QuestBoard>
      <LeaderboardPopup
        position={[0, 3, 0]}
        roomId={roomId}
        roomData={roomData}
        ></LeaderboardPopup>
    </group>
  );
}

export default Room;
