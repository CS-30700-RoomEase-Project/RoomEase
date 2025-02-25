"use client"

import { useState } from "react"
import "./ProfileSettings.css"

const ProfileSettings = ({ onClose }) => {
  // Load data from localStorage
  const storedData = JSON.parse(localStorage.getItem("userData")) || {}

  // State to manage form fields
  const [userData, setUserData] = useState({
    username: storedData.username || "",
    // userId: storedData.userId || "",
    chatFilter: storedData.chatFilter || false,
    profilePic: storedData.profilePic || "",
    totalPoints: storedData.totalPoints || 0,
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Save updated data to localStorage
  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(userData))
    alert("Profile settings saved!")
  }

  return (
    <div className="modal">
      <div className="content">
        <h4>Profile Settings</h4>

        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={userData.username} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label htmlFor="profilePic">Profile Picture URL:</label>
          <input type="text" id="profilePic" name="profilePic" value={userData.profilePic} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label htmlFor="chatFilter">
            <input
              type="checkbox"
              id="chatFilter"
              name="chatFilter"
              checked={userData.chatFilter}
              onChange={handleChange}
            />
            Enable Chat Filter
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="totalPoints">Total Points:</label>
          <input
            type="number"
            id="totalPoints"
            name="totalPoints"
            value={userData.totalPoints}
            onChange={handleChange}
          />
        </div>

        {/* <div className="input-group">
          <label htmlFor="userId">User ID:</label>
          <input type="text" id="userId" name="userId" value={userData.userId} readOnly className="read-only" />
        </div> */}

        <div className="button-group">
          <button className="save-button" onClick={handleSave}>
            Save Settings
          </button>
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings

