"use client"

import { Briefcase } from 'lucide-react'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AvatarButton from "../Shared_components/AvatarButton/AvatarButton"
import NotificationBell from "../Shared_components/NotificationBell/NotificationBell"
import RoomCreationDoor from "../Shared_components/RoomDoors/RoomCreationDoor.js"
import RoomDoor from "../Shared_components/RoomDoors/RoomDoor.js"
import RoomInvite from "../Shared_components/RoomDoors/RoomInvite.js"
import RoomCard from "../Shared_components/RoomImage/RoomCard.js"
import styles from "./Dashboard.module.css"

/**
 * @returns Dashboard component
 */
function Dashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false)

  // Update userData from localStorage on mount
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("userData")) || {}
      console.log("Updated userData:", data)
      setUserData(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error parsing userData:", error)
      setUserData({})
      setIsLoading(false)
    }
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const modal = document.getElementById("rooms-modal")
      if (modal && !modal.contains(event.target) && !event.target.closest(`.${styles.roomsButton}`)) {
        setIsRoomsModalOpen(false)
      }
    }

    if (isRoomsModalOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isRoomsModalOpen])

  // Close modal with escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setIsRoomsModalOpen(false)
      }
    }

    if (isRoomsModalOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isRoomsModalOpen])

  function getRoom(roomId) {
    const roomData = { roomId }
    localStorage.setItem("roomData", JSON.stringify(roomData))
    navigate(`/room/${roomId}`)
    setIsRoomsModalOpen(false)
  }

  const getUserData = () => {
    console.log("userDatfidsfjsiosa: ", userData)
    const userDataTemp = JSON.parse(localStorage.getItem("userData"))
    return userDataTemp
  }

  const acceptInvite = async ({ invite }) => {
    try {
      console.log("userId: ", userData.userId)
      const response = await fetch("http://localhost:5001/api/invite/acceptInvite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData.userId,
          inviteId: invite._id,
        }),
      })

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`)
        alert("Server responded with an error.")
        return
      }

      const result = await response.json()
      alert(result.message)
      localStorage.setItem("userData", JSON.stringify(result.user))
      window.location.reload()
    } catch (error) {
      console.log("Invite removal failed")
    }
  }

  const declineInvite = async ({ invite }) => {
    try {
      console.log(invite._id)
      console.log(invite)
      const response = await fetch("http://localhost:5001/api/invite/deleteInvite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inviteId: invite._id,
          deleterId: userData.userId,
        }),
      })

      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`)
        alert("Server responded with an error.")
        return
      }
      const result = await response.json()
      alert(result.message)
      localStorage.setItem("userData", JSON.stringify(result.reciever))
      console.log(JSON.parse(localStorage.getItem("userData")).invites)
      window.location.reload()
    } catch (error) {
      console.log("Invite removal failed")
    }
  }

  const toggleRoomsModal = () => {
    setIsRoomsModalOpen(!isRoomsModalOpen)
  }

  const handleFileUpload = async (roomId, file) => {
    const formData = new FormData();
    formData.append("roomImage", file); // must match multer's .single('roomImage')
  
    try {
      const response = await fetch(`http://localhost:5001/api/room/uploadRoomImage/${roomId}`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        alert("File upload failed.");
        return;
      }
  
      const result = await response.json();
      // alert(`File uploaded to room with ID: ${result.roomId}`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("There was an error uploading the file.");
    }
  };
  
  
  return (
    <div className={styles.dashboardAppContainer}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape} style={{ "--delay": "0s" }}></div>
        <div className={styles.floatingShape} style={{ "--delay": "2s" }}></div>
        <div className={styles.floatingShape} style={{ "--delay": "4s" }}></div>
        <div className={styles.floatingShape} style={{ "--delay": "6s" }}></div>
      </div>

      <div className={styles.dashboardBanner}>
        <div className={styles.header}>
          <h1>{userData.username ? `${userData.username}'s Rooms` : "Your Rooms"}</h1>
          <div className={styles.headerGlow}></div>
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
          <p className={styles.subheading}>Manage and access your personal and shared spaces</p>
        </div>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your spaces...</p>
          </div>
        ) : (
          <div className={styles.dashboardLayout}>
            {/* Left Column - Rooms */}
            <div className={styles.roomsColumn}>
              <h3 className={styles.columnTitle}>Your Spaces</h3>

              <div className={styles.roomsList}>
                <div className={styles.roomsGrid}>
                  <div className={styles.roomWrapper}>
                    <RoomCreationDoor />
                  </div>
                  
                  {/* Display the Master Room Door if there are more than 1 rooms */}
                  {Array.isArray(userData.rooms) && userData.rooms.length > 1 && (
                  <div className={styles.roomWrapper}>
                    <RoomDoor roomName="Master Room" onClick={() => navigate(`/room/master-room`)}/>
                  </div>)}

                  {/* Your Rooms Button */}
                  
                </div>
                <div className={styles.roomWrapper2}>
                  {Array.isArray(userData.rooms) && userData.rooms.length > 0 && (
                    <div className={styles.roomWrapper} style={{ width: '100%' }}>
                      <div 
                        className={`${styles.roomsButton}`} 
                        onClick={toggleRoomsModal}
                      >
                        <div className={styles.roomIcon}>
                          <Briefcase size={28} />
                        </div>
                        <h3>Your Rooms</h3>
                        <p className={styles.roomCount}>
                          {userData.rooms.length} {userData.rooms.length === 1 ? 'room' : 'rooms'} available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {/* Show the Invite Doors */}
                {Array.isArray(userData.invites) && userData.invites.length > 0 && (
                  <div className={styles.invitesContainer}>
                    <h4 className={styles.invitesTitle}>Pending Invites</h4>
                    <div className={styles.invitesGrid}>
                      {userData.invites.map((invite) => (
                        <div key={invite._id} className={styles.roomWrapper}>
                          <RoomInvite
                            roomName={invite.roomName}
                            accept={() => acceptInvite({ invite })}
                            decline={() => declineInvite({ invite })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Info Blocks */}
            <div className={styles.infoColumn}>
              <h3 className={styles.columnTitle}>Roomease Features</h3>

              <div className={styles.infoBlocksContainer}>
                <div className={styles.infoBlock}>
                  <h4>Grocery Splitting</h4>
                  <p>
                    Ughhh how much did I spend on groceries? With our new grocery splitting feature, you can easily track and split Grociery expenses with your roommates.
                  </p>
                </div>

                <div className={styles.infoBlock}>
                  <h4>Bills & Expenses</h4>
                  <p>
                    Who payed rent, what about utilities? With our new bills and expenses feature, you can easily track and split bills with your roommates.
                  </p>
                </div>

                <div className={styles.infoBlock}>
                  <h4>Quiet Hours & Room's State</h4>
                  <p>
                    Ever need some peace and quiet? With our new quiet hours feature, you can easily set quiet hours in the present and future to give your roomates a headsup.
                  </p>
                </div>

                <div className={styles.infoBlock}>
                  <h4>Chore Managment</h4>
                  <p>
                    Who's turn was it to wash the dishes??? With our new chore management feature, you can easily assign and track chores.
                  </p>
                </div>

                <div className={styles.infoBlock}>
                  <h4>Anonymous Roomate Reviews</h4>
                  <p>
                    Ever want a peaceful way of telling your roomates what they are good and what they are bad at. You can do it anonymously in RoomEase!
                  </p>
                </div>
                {/* Example of how to add more blocks */}
                {/*
                <div className={styles.infoBlock}>
                  <h4>Block Title</h4>
                  <p>Your content here...</p>
                </div>
                */}
              </div>
            </div>
          </div>
        )}

        {/* Rooms Modal */}
        {isRoomsModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.roomsModal} id="rooms-modal">
              <div className={styles.modalHeader}>
                <h3>Select a Room</h3>
                <button className={styles.closeButton} onClick={() => setIsRoomsModalOpen(false)}>
                  ×
                </button>
              </div>
              <div className={styles.modalContent}>
              {userData.rooms &&
                userData.rooms.map((room) => (
                  <div key={room._id} className={styles.roomItem}>
                    {/* <div className={styles.roomItemIcon} onClick={() => getRoom(room._id)} style={{ cursor: 'pointer' }}>
                      <Briefcase size={20} />
                    </div> */}
                    <div className={styles.roomHeader}>
                    <span onClick={() => getRoom(room._id)} style={{ cursor: 'pointer' }}>
                      {room.roomName}
                    </span>

                    {/* File Upload Input */}
                    {/* <input
                      type="file"
                      onChange={(e) => handleFileUpload(room._id, e.target.files[0])}
                      className={styles.fileInput}
                    /> */}

                    </div>
                    
                    {/* RoomCard placed in a separate div */}
                    <div className={styles.roomCardContainer}>
                      <RoomCard roomId={room._id} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerGlow}></div>
        <div className={styles.footerContent}>
          <p>© 2025 RoomEase. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="/privacy-policy" className={styles.footerLink}>
              Privacy Policy
            </a>
            <span className={styles.footerDivider}>|</span>
            <a href="/terms-of-service" className={styles.footerLink}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
