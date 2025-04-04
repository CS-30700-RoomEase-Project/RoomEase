import React, { useEffect, useState } from "react";
import styles from "./RoomState.module.css";

const RoomState = () => {
  const [roomState, setRoomState] = useState(null);
  const [request, setRequest] = useState("");
  const [level, setLevel] = useState("Low");
  const [customLevel, setCustomLevel] = useState("");
  const [roomColor, setRoomColor] = useState("#FFFFFF");

  // Fetch current room state from backend on load
  useEffect(() => {
    const fetchRoomState = async () => {
      const userId = localStorage.getItem("userId");

      try {
        const response = await fetch(`http://localhost:5001/api/roomstate/getRoomState/${userId}`);
        const data = await response.json();

        if (response.ok && data.roomStatus && data.roomState) {
          setRoomState({
            request: data.roomStatus,
            level: "N/A",
            color: data.roomState,
          });
        }
      } catch (err) {
        console.error("Error fetching room state:", err);
      }
    };

    fetchRoomState();
  }, []);

  const handleRequestChange = (e) => {
    setRequest(e.target.value);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setCustomLevel("");
  };

  const handleCustomLevelChange = (e) => {
    setCustomLevel(e.target.value);
  };

  const handleColorChange = (e) => {
    setRoomColor(e.target.value);
  };

  const handleClear = () => {
    setRoomState(null);
  };

  const handleAddState = async (e) => {
    e.preventDefault();

    if (!request.trim()) {
      alert("Request cannot be empty.");
      return;
    }

    const finalLevel = customLevel ? customLevel : level;
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("http://localhost:5001/api/roomstate/addRoomState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request,
          level: finalLevel,
          color: roomColor,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRoomState({ request, level: finalLevel, color: roomColor });
        setRequest("");
        setCustomLevel("");
        alert("Room state added successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding room state:", error);
      alert("Failed to add room state.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Room State</h1>

      {roomState && (
        <div
          className={styles.roomState}
          style={{ backgroundColor: roomState.color || "#FFFFFF" }}
        >
          <h2>Current Room State</h2>
          <p>
            <strong>Request:</strong> {roomState.request}
          </p>
          <p>
            <strong>Level:</strong> {roomState.level}
          </p>
          <button onClick={handleClear} className={styles.clearButton}>
            Clear Room State
          </button>
        </div>
      )}

      <form onSubmit={handleAddState} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="request">Enter Request:</label>
          <input
            type="text"
            id="request"
            name="request"
            value={request}
            onChange={handleRequestChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="level">Set Level:</label>
          <select id="level" name="level" value={level} onChange={handleLevelChange} required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {level === "Custom" && (
          <div className={styles.formGroup}>
            <label htmlFor="customLevel">Enter Custom Level:</label>
            <input
              type="text"
              id="customLevel"
              name="customLevel"
              value={customLevel}
              onChange={handleCustomLevelChange}
              required
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="roomColor">Select Room State Color:</label>
          <input
            type="color"
            id="roomColor"
            name="roomColor"
            value={roomColor}
            onChange={handleColorChange}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RoomState;
