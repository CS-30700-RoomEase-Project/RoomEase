import React from "react"
import './RoomItems.css';

function Clock({ onClick }) {

    return (
<<<<<<< HEAD
        <div className="clock" title="Quiet Hours">
=======
      <div className="clock" onClick={onClick} style={{ cursor: 'pointer' }}>
>>>>>>> main
        <div className="clock-face">
          <div className="hour-hand"></div>
          <div className="minute-hand"></div>
          <div className="center-point"></div>
        </div>
      </div>
    );
};

export default Clock;