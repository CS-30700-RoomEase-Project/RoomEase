import React, { useEffect, useState } from "react";
import "./RoomItems.css";

function Clock({ onClick, enabled }) {
  const [time, setTime] = useState(new Date());
  const [roomColor, setRoomColor] = useState("#FFFFFF");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRoomState = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`http://localhost:5001/api/roomstate/getRoomState/${userId}`);
        const data = await response.json();

        if (response.ok && data.roomState) {
          const formattedColor = data.roomState.startsWith("#")
            ? data.roomState
            : `#${data.roomState}`;
          setRoomColor(formattedColor);
        }
      } catch (error) {
        console.error("Error fetching room color:", error);
      }
    };

    fetchRoomState();
  }, []);

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
          backgroundColor: isHovered ? roomColor : "#FFFFFF",  // Default is white
          borderRadius: "50%",
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          border: "3px solid black",
        }}
        onMouseEnter={() => setIsHovered(true)}  // On hover
        onMouseLeave={() => setIsHovered(false)}  // On mouse leave
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
        />
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
        />
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
        />
      </div>
    </div>
  );
}

export default Clock;
