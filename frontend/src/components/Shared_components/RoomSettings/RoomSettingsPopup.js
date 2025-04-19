import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './RoomSettings.module.css';
import Popup from "reactjs-popup";

const RoomSettingsPopup = ({ isOpen, onClose }) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const initialRoomData = JSON.parse(localStorage.getItem('roomData')) || {};
    const [roomDataState, setRoomDataState] = useState(initialRoomData);
    const currentSettings = roomDataState.settings || [false, false, false, false, false, false, false, false, false, false];
    const [groupPhotoFile, setGroupPhotoFile] = useState(null);

    const navigate = useNavigate();

    const settingsLabels = [
       "Enable Grocery List Sharing",
       "Enable Expense Sharing",
       "Enable Disputes",
       "Enable Quiet Hours",
       "Enable Room State",
       "Enable Chores Splitting",
       "Enable Group Chat",
       "Enable Roommate Reviews",
       "Enable Room Notes",
       "Enable Room Clauses"
    ];

    // Update checkbox change using roomDataState directly
    const handleCheckboxChange = index => e => {
      const newSettings = [...currentSettings];
      newSettings[index] = e.target.checked;
      setRoomDataState({
         ...roomDataState,
         settings: newSettings,   
      });
    };

    // General field change handler
    const handleFieldChange = (e) => {
       const { name, value, type, checked } = e.target;
       setRoomDataState({
         ...roomDataState,
         [name]: type === "checkbox" ? checked : value,
       });
    };

    // Replace the existing group photo handler with one that only stores the file
    const handleGroupPhotoChange = (e) => {
      const file = e.target.files[0];
      setGroupPhotoFile(file);
    };

    // Use the roomDataState in the payload
    const handleSave = async () => {
        const payload = {
            roomId: roomDataState._id,
            settings: roomDataState.settings,
            roomName: roomDataState.roomName,
        };
        try {
            console.log(payload);
            const response = await fetch("http://localhost:5001/api/room/updateRoomSettings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.error(`Error: ${response.status}`);
                alert("Error updating room settings.");
                return;
            }
            const data = await response.json();
            // If a new group photo was selected, upload it now
            if (groupPhotoFile) {
              const formData = new FormData();
              formData.append("roomImage", groupPhotoFile);
              const photoResponse = await fetch(`http://localhost:5001/api/room/uploadRoomImage/${roomDataState._id}`, {
                method: "POST",
                body: formData,
              });
              if (!photoResponse.ok) {
                alert("Group photo update failed.");
              }
            }
            localStorage.setItem("roomData", JSON.stringify(data.roomData));
            alert("Room settings updated successfully.");
            onClose();
        } catch (error) {
        console.error("Error updating room settings:", error);
        alert("An error occurred while updating settings.");
    }
    };

    const handleLeaveRoom = async () => {
      console.log("Leaving room with ID:", roomDataState.roomId);
      console.log("Leaving room with _ID:", roomDataState._id);
      const leaveRoom = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/room/leaveRoom?roomId=${roomDataState._id}&userId=${userData.userId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            if (!response.ok) {
                console.error(`Error: ${response.status}`);
                alert("Error leaving room.");
                return;
            }
            const data = await response.json();

            localStorage.setItem("userData", JSON.stringify(data.userData));

        } catch (error) {
            console.error("Error leaving room:", error);
            alert("An error occurred while leaving the room.");
        }
      }
      await leaveRoom();
      alert("You have left the room.");
      localStorage.removeItem("roomData");
      console.log(userData);
      navigate("/dashboard"); 
      onClose();
      window.location.reload();
    };

    return (
       <Popup
         open={isOpen}
         modal
         nested
         onClose={onClose}
         className={style.roomSettingsContainer}
         overlayClassName={style.roomSettingsPopupOverlay}
         contentClassName={style.roomSettingsPopupContent}
       >
          <div className={style.modal}>
            <div className={style.content}>
              <h3 className={style.settingsTitle}>Room Settings</h3>
              <div className={style.inputGroup}>
                 <label htmlFor="roomName">Room Name:</label>
                 <input
                   type="text"
                   id="roomName"
                   name="roomName"
                   value={roomDataState.roomName || ""}
                   onChange={handleFieldChange}
                 />
              </div>
              {/* Group photo file input */}
              <div className={`${style.inputGroup} ${style.fileInputGroup}`}>
                <label htmlFor="groupPic" className={style.fileFieldLabel}>
                  Group Photo:
                </label>
                <div className={style.fileInputContainer}>
                  {/* Icon that opens file picker */}
                  <label htmlFor="groupPic" className={style.fileUploadIcon}>
                    📤
                  </label>

                  {/* Hidden real input */}
                  <input
                    type="file"
                    id="groupPic"
                    name="groupPic"
                    onChange={handleGroupPhotoChange}
                    className={style.hiddenFileInput}
                  />

                  {/* Chosen file name */}
                  {groupPhotoFile && (
                    <span className={style.fileName}>{groupPhotoFile.name}</span>
                  )}
                </div>
              </div>
              <div className={style.settingsOptions}>
                {settingsLabels.map((label, index) => (
                  <div key={index} className={style.inputGroup}>
                    <label>
                      <input
                        type="checkbox"
                        checked={roomDataState.settings[index]}    
                        onChange={handleCheckboxChange(index)}
                      />
                      {label}
                    </label>
                  </div>
                ))}
              </div>
              <div className={style.buttonGroup}>
                <button className={style.saveButton} onClick={handleSave}>Save</button>
                <button className={style.leaveRoomButton} onClick={handleLeaveRoom}>Leave Room</button>
              </div>
            </div>
          </div>
       </Popup>
    );
};

export default RoomSettingsPopup;