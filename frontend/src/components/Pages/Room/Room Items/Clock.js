// src/Shared_components/Clock/Clock.js
import React, { useEffect, useState } from "react";
import "./clock.css";

export default function Clock({ onClick, enabled }) {
  const [time, setTime] = useState(new Date());
  const [roomColor, setRoomColor] = useState("#FFFFFF");
  const [roomStatus, setRoomStatus] = useState("");
  const [hovered, setHovered] = useState(false);

  const userId = localStorage.getItem("userId");

  // 1️⃣ Tick the clock every second
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  // 2️⃣ Fetch the room‐state “queue” and pull out the current slot
  useEffect(() => {
    async function fetchState() {
      if (!userId) return;
      const res = await fetch(`http://localhost:5001/api/roomstate/queue/${userId}`);
      if (!res.ok) return;
      const { current } = await res.json();
      if (current) {
        // color
        const col = current.color.startsWith("#")
          ? current.color
          : `#${current.color}`;
        setRoomColor(col);
        // status text
        setRoomStatus(current.request);
      }
    }
    fetchState();
  }, [userId]);

  // 3️⃣ Compute hands
  const hours = time.getHours() % 12;
  const mins  = time.getMinutes();
  const secs  = time.getSeconds();
  const hoursDeg   = hours * 30 + mins * 0.5;
  const minutesDeg = mins * 6;
  const secondsDeg = secs * 6;

  return (
    <div
      className="clock-container"
      onClick={onClick}
      title={roomStatus || 'Available'}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="clock-face"
        style={{
          backgroundColor: hovered ? roomColor : "#FFFFFF"
        }}
      >
        <div className="clock-center" />
        <div className="clock-hour"   style={{ transform: `rotate(${hoursDeg}deg)` }} />
        <div className="clock-minute" style={{ transform: `rotate(${minutesDeg}deg)` }} />
        <div className="clock-second" style={{ transform: `rotate(${secondsDeg}deg)` }} />

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="clock-marker"
            style={{ transform: `rotate(${i * 30}deg) translateY(-40px)` }}
          />
        ))}
      </div>
      <div className="clock-frame" />
    </div>
  );
}
