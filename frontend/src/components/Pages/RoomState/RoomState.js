import React, { useState } from "react";
import styles from "./RoomState.module.css";

const RoomState = () => {
  // State for managing room requests and current state
  const [roomState, setRoomState] = useState(null); // Store current state of the room
  const [request, setRequest] = useState(""); // Store input request
  const [level, setLevel] = useState("Low"); // Store the level for the request
  const [customLevel, setCustomLevel] = useState(""); // Store custom level input
  const [timeFormat, setTimeFormat] = useState("24"); // Store time format: "24" for 24-hour, "12" for 12-hour

  // Handle request input change
  const handleRequestChange = (e) => {
    setRequest(e.target.value);
  };

  // Handle level change (selecting a predefined level)
  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setCustomLevel(""); // Reset custom level when predefined level is selected
  };

  // Handle custom level change
  const handleCustomLevelChange = (e) => {
    setCustomLevel(e.target.value);
  };

  // Handle the submit of a new room state request
  const handleSubmit = (e) => {
    e.preventDefault();

    // Use the custom level if it exists, otherwise use the selected level
    const finalLevel = customLevel ? customLevel : level;

    // If the room state is empty, set the new request as the current room state
    if (!roomState) {
      setRoomState({ request, level: finalLevel });
    }

    setRequest(""); // Clear the input field
    setCustomLevel(""); // Clear custom level input
  };

  // Handle the clearing of the room state
  const handleClear = () => {
    setRoomState(null);
  };

  // Toggle between 24-hour and 12-hour time formats
  const toggleTimeFormat = () => {
    setTimeFormat(timeFormat === "24" ? "12" : "24");
  };

  // Function to format time based on the selected format
  const formatTime = (time) => {
    if (timeFormat === "12") {
      const [hours, minutes] = time.split(":");
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
      return `${formattedHours}:${minutes} ${period}`;
    }
    return time; // Return 24-hour time without changes
  };

  return (
    <div className={styles.container}>
      <h1>Room State</h1>

      {/* Display current room state */}
      {roomState ? (
        <div className={styles.roomState}>
          <h2>Current Room State</h2>
          <p>
            <strong>Request:</strong> {roomState.request}
          </p>
          <p>
            <strong>Level:</strong> {roomState.level}
          </p>
          <p>
            <strong>Time Format:</strong> {timeFormat === "24" ? "24-Hour" : "12-Hour"}
          </p>
          <button onClick={handleClear} className={styles.clearButton}>
            Clear Room State
          </button>
        </div>
      ) : (
        <div className={styles.noState}>
          <h2>No room state yet</h2>
        </div>
      )}

      {/* Request input section */}
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
          <select
            id="level"
            name="level"
            value={level}
            onChange={handleLevelChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Custom">Custom</option> {/* Option for Custom level */}
          </select>
        </div>

        {/* Display input field for custom level if selected */}
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
