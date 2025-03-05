"use client"

import { useState } from "react"
import "./CreateRoom.css"


const CreateRoom = ({ onClose }) => {
    let userData = JSON.parse(localStorage.getItem('userData'));

    const [roomData, setRoomData] = useState({
      userId: userData.userId,
      roomName: "",
      groupPic: "",
      roomSettings: [false, false, false, false, false],
    })

    /* Handles when the field is changed */
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setRoomData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const handleCheckboxChange = (index) => (e) => {
      const newSettings = [...roomData.roomSettings];
      newSettings[index] = e.target.checked;
      setRoomData((prev) => ({
        ...prev,
        roomSettings: newSettings,
      }));
    };
  

    const handleSave = async () => {
        localStorage.setItem("roomData", JSON.stringify(roomData));
      
        try {
          const response = await fetch("http://localhost:5001/api/room/createRoom", {
            method: "POST",  // POST method to send data
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: roomData.userId,
              roomName: roomData.roomName,
              groupPic: roomData.groupPic,
              settings: roomData.roomSettings,
            }),  // Send roomData as JSON in the request body
          });

          // Check if the response is OK (status 200)
          if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            alert("Server responded with an error.");
            return;
          }
      
          // Attempt to parse the response as JSON
          const data = await response.json();
          localStorage.setItem("userData", JSON.stringify(data.userData));
          
        } catch (error) {
          console.error("Error in the fetch request:", error);
          alert("An error occurred while creating the room.");
        }
    
        window.location.reload();  // Force reload all React components
    };
      
    return (
      <div className="modal">
        <div className="content">
          <h4>Create Room</h4>
  
          <div className="input-group">
            <label htmlFor="roomName">Room Name:</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={roomData.roomName}
              onChange={handleChange}
            />
          </div>
  
          <div className="input-group">
            <label htmlFor="groupPic">Group Picture URL:</label>
            <input
              type="text"
              id="groupPic"
              name="groupPic"
              value={roomData.groupPic}
              onChange={handleChange}
            />
          </div>
  
          <div className="input-group">
            <label htmlFor="grocery">
              <input
                type="checkbox"
                id="grocery"
                name="grocery"
                checked={roomData.roomSettings[0]}
                onChange={handleCheckboxChange(0)}
              />
              Enable Grocery List Sharing
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="expense">
              <input
                type="checkbox"
                id="expense"
                name="expense"
                checked={roomData.roomSettings[1]}
                onChange={handleCheckboxChange(1)}
              />
              Enable Expense Sharing
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="bulletin">
              <input
                type="checkbox"
                id="bulletin"
                name="bulletin"
                checked={roomData.roomSettings[2]}
                onChange={handleCheckboxChange(2)}
              />
              Enable Bulletin Board
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="quiet-hours">
              <input
                type="checkbox"
                id="quiet-hours"
                name="quiet-hours"
                checked={roomData.roomSettings[3]}
                onChange={handleCheckboxChange(3)}
              />
              Enable Quiet Hours
            </label>
          </div>

          <div className="input-group">
            <label htmlFor="chores">
              <input
                type="checkbox"
                id="chores"
                name="chores"
                checked={roomData.roomSettings[4]}
                onChange={handleCheckboxChange(4)}
              />
              Enable Chores Splitting
            </label>
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
  
  export default CreateRoom