import React from "react";
import { useNavigate } from "react-router-dom";
import AvatarButton from "../Shared_components/AvatarButton/AvatarButton";
import NotificationBell from "../Shared_components/NotificationBell/NotificationBell";
import RoomCreationDoor from "../Shared_components/RoomDoors/RoomCreationDoor.js";
import RoomDoor from "../Shared_components/RoomDoors/RoomDoor.js";
import styles from "./Dashboard.module.css"; // Import Dashboard specific styles
import RoomInvite from "../Shared_components/RoomDoors/RoomInvite.js";

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
    localStorage.setItem("roomData", roomId);
    navigate(`/room/${roomId}`);
  }

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
        console.log("iffjsof13231312312");
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

        {/* Show the Invite Doors */}
        {Array.isArray(userData.invites) &&
          userData.invites.map((invite) => (
            <RoomInvite
              key={invite._id}
              roomName={invite.roomName}
              accept={() => acceptInvite({invite})}
              decline={() => declineInvite({invite})}
            />
          ))}
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
