import React from "react"
import './RoomItems.css';

function Clock() {

    return (
        <div className="clock">
        <div className="clock-face">
          <div className="hour-hand"></div>
          <div className="minute-hand"></div>
          <div className="center-point"></div>
        </div>
      </div>
    );
};

export default Clock;