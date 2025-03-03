import React, { useState } from "react";
import styles from "./QuietHours.module.css";

const roomStartTime = "23:00"; // Change this based on the database
const roomEndTime = "7:00"; // Change this based on the database

function QuietHours() {
  const [quietHours, setQuietHours] = useState({
    startTime: roomStartTime,
    endTime: roomEndTime,
    level: "Medium",
  });

  const [is12HourFormat, setIs12HourFormat] = useState(false); // State to manage time format (12 or 24 hours)
  const [customLevel, setCustomLevel] = useState(""); // State for custom quiet level
  const [levels, setLevels] = useState(["Low", "Medium", "High"]); // Default levels

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Quiet Hours Updated: ${quietHours.startTime} to ${quietHours.endTime}, Level: ${quietHours.level}`
    );
  };

  // Handle input changes
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

  // Format the time based on the selected time format
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
      <h1>Quiet Hours Settings</h1>
      <div className={styles.currentSettings}>
        <h2>Current Quiet Hours</h2>
        <p>
          <strong>Start Time:</strong> {formatTime(quietHours.startTime)}
        </p>
        <p>
          <strong>End Time:</strong> {formatTime(quietHours.endTime)}
        </p>
        <p>
          <strong>Level:</strong> {quietHours.level}
        </p>
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

        <div className={styles.selectAndInput}>
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
        </div>

        <div className={styles.formGroup}>
          <label>Time Format:</label>
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
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default QuietHours;
