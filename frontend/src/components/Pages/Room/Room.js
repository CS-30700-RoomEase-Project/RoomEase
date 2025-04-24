import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../Shared_components/AvatarButton/AvatarButton";
import GroupChat from "../../Shared_components/Messages/GroupChat";
import RateButton from "../../Shared_components/RoomRating/RateButton";
import ExitRoom from "./Room Icons/ExitRoom";
import BulletinBoard from "./Room Items/BulletinBoard";
import ChoreItems from "./Room Items/ChoreItems";
import Clock from "./Room Items/Clock";
import Computer from "./Room Items/Computer";
import Desk from "./Room Items/Desk";
import Fridge from "./Room Items/Fridge";
import Gavel from "./Room Items/Gavel";
import Puppy from "./Room Items/PuppyCosmetic/Puppy";

import BulletinPopup from "../../Shared_components/BulletinPopup/BulletinPopup";
import NotesPopup from "../../Shared_components/BulletinPopup/NotesPopup";
import RoomSettingsPopup from "../../Shared_components/RoomSettings/RoomSettingsPopup";
import CosmeticStorePopup from "./CosmeticStorePopup";
import QuestBell from "../../Shared_components/QuestBell/QuestBell";
import "./Room.css";

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

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setusername(userData?.username);

    if (!userData?.userId) {
      navigate("/login");
      return;
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

  const handleInviteClick = () => {
    navigate(`/room/${roomId}/invite`);
  };

  const handleSettingsClick = () => {
    setShowSettingsPopup(true);
  };

  const handleGoToChores = (roomId) => {
    console.log("Navigating to chores with roomId:", roomId);
    navigate(`/chores/${roomId}`);
  };

  const handleGoToState = (roomId) => {
    console.log("Navigating to state with roomId:", roomId);
    navigate(`/room-state/${roomId}`);
  };

  const handleGoToDisputes = (roomId) => {
    if (roomData.settings[2]) {
      console.log("Navigating to disputes with roomId:", roomId);
      navigate(`/disputes/${roomId}`);
    }
  };

  const goToSubmitDispute = () => {
    if (roomData.settings[2]) {
      console.log("Navigating to submit dispute with roomId:", roomId);
      navigate(`/submit-dispute/${roomId}`);
    }
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

  return (
    <>
      <div className="appContainer">
        <div className="roomBanner">
          <ExitRoom
            onClick={() => navigate("/dashboard")}
            style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          />
          <QuestBell></QuestBell>
          <button onClick={() => setCosmeticPopupOpen(true)}>
            Open Cosmetic Store
          </button>
          <h1 className="roomTitle">{roomData.roomName}</h1>
          <div className="roomBannerMini">
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
        />
        <NotesPopup
          room={roomData}
          isOpen={showNotesPopup}
          onClose={() => setShowNotesPopup(false)}
          initialNotes={roomData.bulletinNotes}
        />

        <div className="roomBackground">
          <div className="upperSection">
            <div className="upperLeft"></div>
            <div className="upperMiddle">
              <div className="hover-container">
                <BulletinBoard
                  onClick={handleBulletinClick}
                  enabled={
                    roomData.settings[3] ||
                    roomData.settings[9] ||
                    roomData.settings[8]
                  }
                  style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                />
                <span className="hover-label">
                  Quiet Hours, Room Notes, Room Clauses
                </span>
              </div>
            </div>
            <div className="upperRight">
              <div className="hover-container">
                <Clock
                  onClick={() => handleGoToState(roomId)}
                  enabled={roomData.settings[4]}
                  style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                />
                <span className="hover-label">Room State</span>
              </div>
            </div>
          </div>

          <div className="floorItems">
            <div className="floorLeft">
              <div className="hover-container">
                <Fridge
                  room={roomData}
                  enabled={roomData.settings[0]}
                  style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  roomCosmetics={cosmeticData}
                />
                <span className="hover-label">Grocries</span>
              </div>
            </div>
            <div className="floorMiddle">
              <Desk
                gavelVisible={true}
                computer={
                  <div className="hover-container">
                    <Computer
                      handleInviteClick={handleInviteClick}
                      handleSettingsClick={handleSettingsClick}
                      roomId={roomData._id}
                      roomData={roomData}
                      style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                    />
                    <span className="hover-label">
                      Settings, Invites, Bills
                    </span>
                  </div>
                }
                onGavelPadClick={goToSubmitDispute}
                style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
              >
                <div className="hover-container">
                  <Gavel
                    onClick={() => handleGoToDisputes(roomId)}
                    enabled={roomData.settings[2]}
                    style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  />
                  <span className="hover-label">Disputes</span>
                </div>
              </Desk>
            </div>

            <div className="floorRight">
              <Puppy visible={cosmeticData.activeDecorations?.["Puppy"]} />
              <div className="hover-container">
                <ChoreItems
                  onClick={() => handleGoToChores(roomId)}
                  enabled={roomData.settings[5]}
                  style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                />
                <span className="hover-label">Chores</span>
              </div>
            </div>
          </div>
        </div>
        <div className="roomFloor" />
      </div>

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
    </>
  );
}

export default Room;
