import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarButton from "../Shared_components/AvatarButton/AvatarButton";
import NotificationBell from "../Shared_components/NotificationBell/NotificationBell";
import RoomCreationDoor from "../Shared_components/RoomDoors/RoomCreationDoor.js";
import RoomDoor from "../Shared_components/RoomDoors/RoomDoor.js";
import styles from "./Dashboard.module.css"; // Import Dashboard specific styles

/**
 * @returns Dashboard component
 */
function Dashboard() {
  const navigate = useNavigate();

  // Safely parse userData from localStorage
  let userData;
  try {
    userData = JSON.parse(localStorage.getItem("userData")) || {};
  } catch (error) {
    console.error("Error parsing userData:", error);
    userData = {};
  }

  const handleQuietHoursClick = () => {
    navigate("/quiet-hours");
  };

  function getRoom(roomId) {
    localStorage.setItem("roomData", roomId);
    navigate(`/room/${roomId}`);
  }

  return (
    <div className={styles.dashboardAppContainer}>
      <div className={styles.dashboardBanner}>
        <div className={styles.header}>
          <h1>{userData.username ? `${userData.username}'s Rooms` : "Your Rooms"}</h1>
        </div>
        <NotificationBell />
        <AvatarButton />
      </div>
      <div className={styles.dashboardContent}>
        <RoomCreationDoor />
        <RoomDoor roomName="Master Room" />

        {/* Ensure userData.rooms exists and is an array */}
        {Array.isArray(userData.rooms) &&
          userData.rooms.map((room) => (
            <RoomDoor
              key={room._id}
              roomName={room.roomName}
              onClick={() => getRoom(room._id)}
            />
          ))}

        <div className={styles.quietHoursSection} onClick={handleQuietHoursClick}>
          <h2>Quiet Hours Settings</h2>
          <p>Configure quiet hours for your rooms.</p>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>© 2025 RoomEase. All rights reserved.</p>
        <p>
          <a href="/privacy-policy" className={styles.footerLink}>Privacy Policy</a> |{" "}
          <a href="/terms-of-service" className={styles.footerLink}>Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
