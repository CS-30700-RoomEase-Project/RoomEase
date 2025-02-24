import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../Shared_components/NotificationBell/NotificationBell";
import AvatarButton from "../Shared_components/AvatarButton/AvatarButton";
import RoomDoor from "../Shared_components/RoomDoors/RoomDoor.js";
import RoomCreationDoor from "../Shared_components/RoomDoors/RoomCreationDoor.js";
import styles from "./Dashboard.module.css"; // Import Dashboard specific styles

/**
 * @returns Dashboard component
 */
function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePic');
    navigate('/');
  };
  let userData = JSON.parse(localStorage.getItem('userData'));
  
  const handleQuietHoursClick = () => {
    navigate('/quiet-hours');
  }

  const rooms = [];
  for (let i = 1; i <= 10; i++) {
    rooms.push(<RoomDoor key={i} roomName={`Room ${i}`} />);
  }

  return (
    <div className={styles.dashboardAppContainer}>
      <div className={styles.dashboardBanner}>
        <div className={styles.header}>
          <h1>{userData.username}'s Rooms</h1>
        </div>
        <NotificationBell></NotificationBell>
        <AvatarButton imageUrl={userData.profilePic}></AvatarButton>
      </div>
      <div className={styles.dashboardContent}>
        <div className={styles.quietHoursSection} onClick={handleQuietHoursClick}>
          <h2>Quiet Hours Settings</h2>
          <p>Configure quiet hours for your rooms.</p>
        </div>
        
        <RoomCreationDoor/>
        <RoomDoor roomName="Master Room" />
        {rooms}
        
      </div>
    </div>
  );
}

export default Dashboard;
