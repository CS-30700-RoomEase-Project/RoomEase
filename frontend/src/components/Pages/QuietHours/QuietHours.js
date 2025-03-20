import React, { useState } from "react";
import styles from "./QuietHours.module.css";

const roomStartTime = "23:00"; // Default value for start time
const roomEndTime = "7:00"; // Default value for end time

function QuietHours() {
  const [quietHours, setQuietHours] = useState({
    startTime: roomStartTime,
    endTime: roomEndTime,
    level: "Medium",
  });

  const [is12HourFormat, setIs12HourFormat] = useState(false); // State to manage time format (12 or 24 hours)
  const [customLevel, setCustomLevel] = useState(""); // State for custom quiet level
  const [levels, setLevels] = useState(["Low", "Medium", "High"]); // Default levels

  // Handle form submission and send to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalLevel = customLevel ? customLevel : quietHours.level;

    try {
      const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage

      // Send POST request to backend
      const response = await fetch("http://localhost:5001/api/quiethours/addQuietHours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request: `Quiet Hours Updated: ${quietHours.startTime} to ${quietHours.endTime}`,
          level: finalLevel,
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Quiet hours updated and users notified!");
        // Reset the state after successful update
        setQuietHours({ startTime: roomStartTime, endTime: roomEndTime, level: "Medium" });
        setCustomLevel("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating quiet hours:", error);
      alert("Failed to update quiet hours.");
    }
  };

  // Handle input changes for quiet hours
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuietHours((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle adding a custom level
  const handleAddCustomLevel = () => {
    if (customLevel && !levels.includes(customLevel)) {
      setLevels([...levels, customLevel]);
      setCustomLevel(""); // Reset custom level input
    }
  };

  // Format the time based on the selected time format (12-hour or 24-hour)
  const formatTime = (time) => {
    if (is12HourFormat) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    }
    return time; // 24-hour format
  };

  return (
    <div className={styles.container}>
      <div className={styles.quietHours}>
        <h2>Current Quiet Hours</h2>
        <p><strong>Start Time:</strong> {formatTime(quietHours.startTime)}</p>
        <p><strong>End Time:</strong> {formatTime(quietHours.endTime)}</p>
        <p><strong>Level:</strong> {quietHours.level}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Set New Quiet Hours</h2>
        <div className={styles.formGroup}>
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={quietHours.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={quietHours.endTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="level">Quiet Level:</label>
          <select
            id="level"
            name="level"
            value={quietHours.level}
            onChange={handleChange}
            required
          >
            {levels.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.addLevelContainer}>
          <input
            type="text"
            value={customLevel}
            onChange={(e) => setCustomLevel(e.target.value)}
            className={styles.customLevelInput}
            placeholder="Add custom level"
          />
          <button
            type="button"
            onClick={handleAddCustomLevel}
            className={styles.addLevelButton}
          >
            Add Level
          </button>
        </div>

        <div className={styles.timeFormatContainer}>
          <button
            type="button"
            onClick={() => setIs12HourFormat(false)}
            className={`${styles.timeFormatButton} ${!is12HourFormat ? styles.active : ""}`}
          >
            24-Hour Time
          </button>
          <button
            type="button"
            onClick={() => setIs12HourFormat(true)}
            className={`${styles.timeFormatButton} ${is12HourFormat ? styles.active : ""}`}
          >
            12-Hour Time
          </button>
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default QuietHours;
