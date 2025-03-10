import React from "react";
import "../ComputerIcons.css";

function RoomSettingsIcon({ onClick }) {
  return (
    <div className="gear-container" title="Room Settings">
      <img className="gear" src={require("./settings-icon.png")} onClick={onClick}/>
    </div>
);
}

export default RoomSettingsIcon;