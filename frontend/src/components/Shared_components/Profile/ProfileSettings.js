"use client"

import { useState } from "react"
import "./ProfileSettings.css"

const ProfileSettings = ({ onClose }) => {
  const storedData = JSON.parse(localStorage.getItem("userData")) || {}

  const [userData, setUserData] = useState({
    username: storedData.username || "",
    chatFilter: storedData.chatFilter || false,
    profilePic: storedData.profilePic || "",
    totalPoints: storedData.totalPoints || 0,
    contactInfo: storedData.contactInfo || 1111111111,
    reviews: storedData.reviews || [],
    userId: storedData.userId || "",
    birthday: storedData.birthday || "01012000",
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSave = async () => {
    if (userData.contactInfo.toString().length !== 10) {
      alert("Phone number must be exactly 10 digits long.");
      return;
    }

    if (userData.birthday.replace(/\D/g, "").length !== 8) {
      alert("Birthday must be exactly 8 digits long.");
      return;
    }

    localStorage.setItem("userData", JSON.stringify(userData));
  
    try {
      const response = await fetch("http://localhost:5001/api/users/profile/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        alert("Server responded with an error.");
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("userData", JSON.stringify(data.userData));
    } catch (error) {
      console.error("Error in the fetch request:", error);
      alert("An error occurred while sending the profile data.");
    }

    window.location.reload();
  };

  return (
    <div className="modal">
      <div className="content">
        <h4>Profile Settings</h4>

        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="profilePic">Profile Picture URL:</label>
          <input
            type="text"
            id="profilePic"
            name="profilePic"
            value={userData.profilePic}
            onChange={handleChange}
          />
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
          <label htmlFor="contactInfo">Phone Number:</label>
          <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            value={(userData.contactInfo ?? "").toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
            onChange={(e) => {
              const formattedValue = e.target.value.replace(/\D/g, "").slice(0, 10);
              handleChange({ target: { name: "contactInfo", value: formattedValue } });
            }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="birthday">Birthday:</label>
          <input
            type="text"
            id="birthday"
            name="birthday"
            value={userData.birthday.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3")}
            onChange={(e) => {
              const formattedValue = e.target.value.replace(/\D/g, "").slice(0, 8);
              handleChange({ target: { name: "birthday", value: formattedValue } });
            }}
          />
        </div>

        <div className="button-group">
          <button className="save-button" onClick={() => { handleSave(); onClose(); }}>
            Save
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