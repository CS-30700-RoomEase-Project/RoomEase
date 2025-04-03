import React, { useEffect, useState } from "react";
import "./RoomItems.css";

function Clock({ onClick, enabled, roomState }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date()); // Update time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Determine clock face color based on room state
  const getColorByRoomState = (state) => {
    switch (state) {
      case "Low":
        return "#90EE90"; // Light green
      case "Medium":
        return "#FFD700"; // Gold
      case "High":
        return "#FF4500"; // Red
      default:
        return "#FFFFFF"; // Default white
    }
  };

  const clockFaceColor = getColorByRoomState(roomState);

  // Calculate rotation angles
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const hoursDeg = hours * 30 + minutes * 0.5;
  const minutesDeg = minutes * 6;

  return (
    <div
      className="clock"
      onClick={onClick}
      title={enabled ? "Room State" : ""}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none",
      }}
    >
      <div
        className="clock-face"
        style={{
          backgroundColor: clockFaceColor,
          borderRadius: "50%", // Ensures the clock remains a perfect circle
          width: "100px", // Adjust size as needed
          height: "100px", // Adjust size as needed
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: "3px solid black", // Optional border for better visibility
        }}
      >
        <div
          className="hour-hand"
          style={{
            transform: `rotate(${hoursDeg}deg)`,
            position: "absolute",
            width: "4px",
            height: "30px",
            backgroundColor: "black",
            top: "20px",
            left: "50%",
            transformOrigin: "bottom",
          }}
        ></div>
        <div
          className="minute-hand"
          style={{
            transform: `rotate(${minutesDeg}deg)`,
            position: "absolute",
            width: "3px",
            height: "40px",
            backgroundColor: "black",
            top: "10px",
            left: "50%",
            transformOrigin: "bottom",
          }}
        ></div>
        <div
          className="center-point"
          style={{
            width: "6px",
            height: "6px",
            backgroundColor: "black",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Clock;
