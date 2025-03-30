import React from "react"
import './RoomItems.css';

function Clock({ onClick, enabled }) {

    return (
      <div className="clock" onClick={onClick} title={(enabled) ? "Room State" : ""} style={{ cursor: 'pointer', pointerEvents: (enabled) ? "auto" : "none" }}>
        <div className="clock-face">
          <div className="hour-hand"></div>
          <div className="minute-hand"></div>
          <div className="center-point"></div>
        </div>
      </div>
    );
};

export default Clock;