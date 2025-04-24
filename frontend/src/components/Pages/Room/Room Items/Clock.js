"use client"

import { useEffect, useState } from "react"
import "./clock.css"

function Clock({ onClick, enabled }) {
  const [time, setTime] = useState(new Date())
  const [roomColor, setRoomColor] = useState("#FFFFFF")
  const [roomStatus, setRoomStatus] = useState("")      // ← NEW: holds the fetched status string
  const [isHovered, setIsHovered] = useState(false)

  // ticking clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // fetch both roomColor and roomStatus
  useEffect(() => {
    const fetchRoomState = async () => {
      const userId = localStorage.getItem("userId")
      try {
        const response = await fetch(
          `http://localhost:5001/api/roomstate/getRoomState/${userId}`
        )
        const data = await response.json()

        if (response.ok && data.roomState) {
          // set the color
          const formattedColor = data.roomState.startsWith("#")
            ? data.roomState
            : `#${data.roomState}`
          setRoomColor(formattedColor)

          // set the status text (you may need to adjust if your API returns
          // roomStatus separately; here we assume it's in data.roomStatus)
          if (data.roomStatus) {
            setRoomStatus(data.roomStatus)
          }
        }
      } catch (error) {
        console.error("Error fetching room state:", error)
      }
    }

    fetchRoomState()
  }, [])

  // compute hand angles
  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const hoursDeg = hours * 30 + minutes * 0.5
  const minutesDeg = minutes * 6
  const secondsDeg = seconds * 6

  return (
    <div
      className="clock-container"
      onClick={onClick}
      title={enabled ? roomStatus : ""}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="clock-face"
        style={{
          backgroundColor: isHovered ? roomColor : "#FFFFFF",
        }}
      >
        <div className="clock-center" />
        <div className="clock-hour" style={{ transform: `rotate(${hoursDeg}deg)` }} />
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
  )
}

export default Clock
