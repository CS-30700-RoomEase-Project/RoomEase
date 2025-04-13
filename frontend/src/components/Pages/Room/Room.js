import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import GroupChat from '../../Shared_components/Messages/GroupChat';
import RateButton from '../../Shared_components/RoomRating/RateButton';
import ExitRoom from './Room Icons/ExitRoom';
import BulletinBoard from './Room Items/BulletinBoard';
import ChoreItems from './Room Items/ChoreItems';
import Clock from './Room Items/Clock';
import Computer from './Room Items/Computer';
import Desk from './Room Items/Desk';
import Fridge from './Room Items/Fridge';
import Gavel from './Room Items/Gavel';

import BulletinPopup from '../../Shared_components/BulletinPopup/BulletinPopup';
import NotesPopup from "../../Shared_components/BulletinPopup/NotesPopup";
import './Room.css';

function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [showBulletin, setShowBulletin] = useState(false);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setusername] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setusername(userData.username);
    console.log(userData);

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
        localStorage.setItem("roommates", JSON.stringify(data.room.roomMembers));
        setRoomData(data.room);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  const handleInviteClick = () => {
    navigate(`/room/${roomId}/invite`);
  };

  const handleSettingsClick = () => {
    navigate(`/room/${roomId}/settings`);
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

  const handleBulletinClick = () => {
    if (roomData.settings[3] || roomData.settings[9] || roomData.settings[8]) {
      setShowBulletin(true);
    } else {
      return;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="appContainer">
        <div className="roomBanner">
          <ExitRoom onClick={() => navigate("/dashboard")} style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          <h1 className="roomTitle">{roomData.roomName}</h1>
          <div className="roomBannerMini">
            {roomData.settings[7] && <RateButton style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />}
            {roomData.settings[6] && <GroupChat roomId={roomId} userName={username} style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />}
            <Avatar style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
          </div>
        </div>

        <div className="roomBackground">
          <div className="upperSection">
            <div className="upperLeft"></div>
            <div className="upperMiddle">
              <div className="hover-container">
                <BulletinBoard
                  onClick={handleBulletinClick}
                  enabled={roomData.settings[3] || roomData.settings[9] || roomData.settings[8]}
                  style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                />
                <span className="hover-label">Quiet Hours, Room Notes, Room Clauses</span>
              </div>
            </div>
            <div className="upperRight">
              <div className="hover-container">
                <Clock onClick={() => handleGoToState(roomId)} enabled={roomData.settings[4]} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
                <span className="hover-label">Room State</span>
              </div>
            </div>
          </div>

          <div className="floorItems">
            <div className="floorLeft">
              <div className="hover-container">
                <Fridge room={roomData} enabled={roomData.settings[0]} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
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
                      style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    />
                    <span className="hover-label">Settings, Invites, Bills</span>
                  </div>
                }
                style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              >
                <div className="hover-container">
                  <Gavel
                    onClick={() => handleGoToDisputes(roomId)}
                    enabled={roomData.settings[2]}
                    style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                  />
                  <span className="hover-label">Disputes</span>
                </div>
              </Desk>
            </div>

            <div className="floorRight">
              <div className="hover-container">
                <ChoreItems onClick={() => handleGoToChores(roomId)} enabled={roomData.settings[5]} style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
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
        settings={[roomData.settings[3], roomData.settings[9], roomData.settings[8]]}
        roomId={roomId}
        onOpenNotes={() => setShowNotesPopup(true)}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      />

      <NotesPopup
        room={roomData}
        isOpen={showNotesPopup}
        onClose={() => setShowNotesPopup(false)}
        initialNotes={roomData.bulletinNotes}
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      />
    </>
  );
}

export default Room;