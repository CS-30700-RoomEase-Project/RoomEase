import React, { useState } from 'react';
import style from './RoomSettings.module.css'; // changed to CSS modules
import Popup from "reactjs-popup";

const RoomSettingsPopup = ({ isOpen, onClose }) => {
    // Always call hooks first
    const userData = JSON.parse(localStorage.getItem('userData'));
    const roomData = JSON.parse(localStorage.getItem('roomData')) || {};
    const initialSettings = roomData.roomSettings || [false, false, false, false, false, false, false, false, false, false];
    const [settings, setSettings] = useState(initialSettings);


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

    // Update checkbox for each setting
    const handleCheckboxChange = index => e => {
        const updated = [...settings];
        updated[index] = e.target.checked;
        setSettings(updated);
    };

    // Call API to update room settings
    const handleSave = async () => {
        const payload = {
            roomId: roomData.roomId, // assuming roomId exists
            settings
        };
        try {
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
            // Optionally update localStorage with new room data
            localStorage.setItem("roomData", JSON.stringify(data.roomData));
            alert("Room settings updated successfully.");
            onClose();
        } catch (error) {
            console.error("Error updating room settings:", error);
            alert("An error occurred while updating settings.");
        }
    };

    // Call API to leave the room
    const handleLeaveRoom = async () => {
        const payload = {
            roomId: roomData.roomId, // assuming roomId exists
            userId: userData.userId
        };
        try {
            const response = await fetch("http://localhost:5001/api/room/leaveRoom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.error(`Error: ${response.status}`);
                alert("Error leaving room.");
                return;
            }
            alert("You have left the room.");
            localStorage.removeItem("roomData");
            window.location.reload();
        } catch (error) {
            console.error("Error leaving room:", error);
            alert("An error occurred while leaving the room.");
        }
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
        <div className={style.popupOverlay}>
            <div className={style.popupContent}>
                <button className={style.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h3>Room Settings</h3>
                <div className={style.settingsOptions}>
                    {settingsLabels.map((label, index) => (
                        <div key={index} className={style.inputGroup}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={settings[index]}
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
                    </div>
                </Popup>
    );
};

export default RoomSettingsPopup;