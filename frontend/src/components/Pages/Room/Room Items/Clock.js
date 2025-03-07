import React from "react"
import './RoomItems.css';

function Clock({ onClick }) {

    return (
      <div className="clock" onClick={onClick} title="Quiet Hours" style={{ cursor: 'pointer' }}>
        <div className="clock-face">
          <div className="hour-hand"></div>
          <div className="minute-hand"></div>
          <div className="center-point"></div>
        </div>
      </div>
    );
};

export default Clock;