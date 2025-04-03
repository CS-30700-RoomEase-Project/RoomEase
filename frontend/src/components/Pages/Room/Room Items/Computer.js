import React from 'react';
import RoomSettingsIcon from "./ComputerContent/SettingsIcon/RoomSettingsIcon";
import InviteIcon from "./ComputerContent/InviteIcon/InviteIcon";
import BillsIcon from "./ComputerContent/BillIcon/BillsIcon"
import { useNavigate } from 'react-router-dom';
import "./RoomItems.css";

function Computer({ handleSettingsClick, handleInviteClick, roomId, roomData }) {
  const navigate = useNavigate();

  const handleGoToBills = () => {
      navigate(`/room/${roomId}/bills`);
  };

  return (
    <div className="computer-container">
      <div className="monitor-frame">
        <div className="monitor-screen">
          {(roomId != "master-room") && <RoomSettingsIcon onClick={handleSettingsClick} />}
          {(roomId != "master-room") && <InviteIcon onClick={handleInviteClick} />}
          {(roomId == "master-room" || roomData.settings[1]) && <BillsIcon onClick={handleGoToBills} />}
        </div>
      </div>
      <div className="computer-stand"></div>
      <div className="computer-base"></div>
    </div>
  );
}

export default Computer;

