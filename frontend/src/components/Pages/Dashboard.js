import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarButton from "../Shared_components/AvatarButton/AvatarButton";
import NotificationBell from "../Shared_components/NotificationBell/NotificationBell";
import RoomCreationDoor from "../Shared_components/RoomDoors/RoomCreationDoor.js";
import RoomDoor from "../Shared_components/RoomDoors/RoomDoor.js";
import RoomInvite from "../Shared_components/RoomDoors/RoomInvite.js";
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
    console.log(userData);
  } catch (error) {
    console.error("Error parsing userData:", error);
    userData = {};
  }

  function getRoom(roomId) {
    const roomData = { roomId }; // Creating an object with roomId (you can add more properties if needed)
    localStorage.setItem("roomData", JSON.stringify(roomData));
    navigate(`/room/${roomId}`);
  }
  


  const getUserData = () => {
    console.log("userDatfidsfjsiosa: ", userData);
    userData = JSON.parse(localStorage.getItem("userData"));
    return JSON.parse(localStorage.getItem("userData"));
  };

  const acceptInvite = async ({invite}) => {
    try {
      console.log("userId: ", userData.userId);
      const response = await fetch("http://localhost:5001/api/invite/acceptInvite", {
          method: "POST",  // POST method to send data
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              userId: userData.userId,
              inviteId: invite._id
          }),  
      });

      // Check if the response is OK (status 200)
      if (!response.ok) {
          console.error(`Error: ${response.status} - ${response.statusText}`);
          alert("Server responded with an error.");
          return;
      }

      const result = await response.json();
      alert(result.message);
      localStorage.setItem("userData", JSON.stringify(result.user));
      window.location.reload();
    } catch (error) {
      console.log("Invite removal failed");
    }
  };

  const declineInvite = async ({invite}) => {
    try {
        console.log(invite._id);
        console.log(invite);
        const response = await fetch("http://localhost:5001/api/invite/deleteInvite", {
            method: "DELETE",  // POST method to send data
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                inviteId: invite._id,
                deleterId: userData.userId,
            }),  
        });
        
        // Check if the response is OK (status 200)
        if (!response.ok) {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            alert("Server responded with an error.");
            return;
        }
        const result = await response.json();
        alert(result.message);
        localStorage.setItem("userData", JSON.stringify(result.reciever));
        console.log(JSON.parse(localStorage.getItem("userData")).invites);
        window.location.reload();
    } catch (error) {
        console.log("Invite removal failed");
    }
  }


  return (
    <div className={styles.dashboardAppContainer}>
      <div className={styles.dashboardBanner}>
        <div className={styles.header}>
          <h1>{userData.username ? `${userData.username}'s Rooms` : "Your Rooms"}</h1>
        </div>
        <div className={styles.headerActions}>
          <NotificationBell />
          <AvatarButton />
        </div>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.contentHeading}>
          <h2>Your Spaces</h2>
          <div className={styles.contentDivider}></div>
        </div>
        
        <div className={styles.roomsGrid}>
          <div className={styles.roomWrapper}>
            <RoomCreationDoor />
          </div>
          
          <div className={styles.roomWrapper}>
            <RoomDoor roomName="Master Room" />
          </div>

          {/* Ensure userData.rooms exists and is an array */}
          {Array.isArray(getUserData().rooms) &&
            userData.rooms.map((room) => (
              <div key={room._id} className={styles.roomWrapper}>
                <RoomDoor
                  roomName={room.roomName}
                  onClick={() => getRoom(room._id)}
                />
              </div>
            ))}

          {/* Show the Invite Doors */}
          {Array.isArray(userData.invites) &&
            userData.invites.map((invite) => (
              <div key={invite._id} className={styles.roomWrapper}>
                <RoomInvite
                  roomName={invite.roomName}
                  accept={() => acceptInvite({invite})}
                  decline={() => declineInvite({invite})}
                />
              </div>
            ))}
        </div>
      </div>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© 2025 RoomEase. All rights reserved.</p>
          <p>
            <a href="/privacy-policy" className={styles.footerLink}>Privacy Policy</a> |{" "}
            <a href="/terms-of-service" className={styles.footerLink}>Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
