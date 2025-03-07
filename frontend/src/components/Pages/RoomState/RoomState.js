import React, { useState } from "react";
import styles from "./RoomState.module.css";

const RoomState = () => {
  const [roomState, setRoomState] = useState(null);
  const [request, setRequest] = useState("");
  const [level, setLevel] = useState("Low");
  const [customLevel, setCustomLevel] = useState("");
  const [timeFormat, setTimeFormat] = useState("24");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalLevel = customLevel ? customLevel : level;

    if (!roomState) {
      setRoomState({ request, level: finalLevel });
    }

    setRequest("");
    setCustomLevel("");
  };

  const handleClear = () => {
    setRoomState(null);
  };

  return (
    <div className={styles.container}>
      <h1>Room State</h1>

      {roomState ? (
        <div className={styles.roomState}>
          <h2>Current Room State</h2>
          <p><strong>Request:</strong> {roomState.request}</p>
          <p><strong>Level:</strong> {roomState.level}</p>
          <button onClick={handleClear} className={styles.clearButton}>
            Clear Room State
          </button>
        </div>
      ) : (
        <div className={styles.noState}>
          <h2>No room state yet</h2>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
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

        <button type="submit" className={styles.submitButton}>
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RoomState;
