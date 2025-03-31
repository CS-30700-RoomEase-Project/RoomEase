import React, { useEffect, useState } from "react";
import "./RoomItems.css";

function Clock({ onClick, enabled }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date()); // Update time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Calculate rotation angles
  const hours = time.getHours() % 12; // Convert 24-hour format to 12-hour
  const minutes = time.getMinutes();
  const hoursDeg = (hours * 30) + (minutes * 0.5); // 30° per hour, 0.5° per minute
  const minutesDeg = minutes * 6; // 6° per minute

  return (
    <div className="clock" onClick={onClick} title={(enabled) ? "Room State" : ""} style={{ cursor: 'pointer', pointerEvents: (enabled) ? "auto" : "none" }}>
      <div className="clock-face">
        <div className="hour-hand" style={{ transform: `rotate(${hoursDeg}deg)` }}></div>
        <div className="minute-hand" style={{ transform: `rotate(${minutesDeg}deg)` }}></div>
        <div className="center-point"></div>
      </div>
    </div>
  );
}

export default Clock;
