import React, { useState } from "react";
import styles from "./QuietHours.module.css";

const roomStartTime = "12:00" // Change this based on the database
const roomEndTime = "8:00" // Change this based on the database

function QuietHours() {
  // State for quiet hours
  const [quietHours, setQuietHours] = useState({
    startTime: roomStartTime,
    endTime: roomEndTime,
    level: "Medium",
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Quiet Hours Updated: ${quietHours.startTime} to ${quietHours.endTime}, Level: ${quietHours.level}`);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuietHours((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Quiet Hours Settings</h1>
      <div className={styles.currentSettings}>
        <h2>Current Quiet Hours</h2>
        <p>
          <strong>Start Time:</strong> {quietHours.startTime}
        </p>
        <p>
          <strong>End Time:</strong> {quietHours.endTime}
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

        <div className={styles.formGroup}>
          <label htmlFor="level">Quiet Level:</label>
          <select
            id="level"
            name="level"
            value={quietHours.level}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default QuietHours;