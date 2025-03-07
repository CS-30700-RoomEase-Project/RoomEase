import React from 'react';
import RoomSettingsIcon from "./ComputerContent/SettingsIcon/RoomSettingsIcon";
import InviteIcon from "./ComputerContent/InviteIcon/InviteIcon";
import "./RoomItems.css";

function Computer({ handleSettingsClick, handleInviteClick}) {
  return (
    <div className="computer-container">
      <div className="monitor-frame">
        <div className="monitor-screen">
          <RoomSettingsIcon onClick={handleSettingsClick} />
          <InviteIcon onClick={handleInviteClick} />
        </div>
      </div>
      <div className="computer-stand"></div>
      <div className="computer-base"></div>
    </div>
  )
}

export default Computer;