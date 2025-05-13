"use client"

import { Bell, Briefcase, Home, Settings, User, Users } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import AvatarButton from "../Shared_components/AvatarButton/AvatarButton"
import NotificationBell from "../Shared_components/NotificationBell/NotificationBell"
import ProfileSettings from "../Shared_components/Profile/ProfileSettings.js"
import RoomCreationDoor from "../Shared_components/RoomDoors/RoomCreationDoor.js"
import RoomDoor from "../Shared_components/RoomDoors/RoomDoor.js"
import styles from "./Dashboard.module.css"
/**
 * @returns Dashboard component
 */
function Dashboard() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false)
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("spaces")
  const modalRef = useRef(null)
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)

  // Update userData from localStorage on mount
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("userData")) || {}
      console.log("Updated userData:", data)
      setUserData(data)

      // Simulate loading for smoother transition
      setTimeout(() => {
        setIsLoading(false)
      }, 800)
    } catch (error) {
      console.error("Error parsing userData:", error)
      setUserData({})
      setIsLoading(false)
    }
  }, [])

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(`.${styles.roomsButton}`)
      ) {
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

  // For scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.animate)
            if (entry.target === statsRef.current) {
              setStatsVisible(true)
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const animatedElements = document.querySelectorAll(`.${styles.animateOnScroll}`)
    animatedElements.forEach((el) => observer.observe(el))

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el))
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [])

  // Counter animation
  const Counter = ({ end, label, suffix = "" }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!statsVisible) return

      let start = 0
      const duration = 2000 // 2 seconds
      const step = end / (duration / 16) // 60fps

      const timer = setInterval(() => {
        start += step
        if (start > end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }, [statsVisible, end])

    return (
      <div className={styles.statCard}>
        <div className={styles.statNumber}>
          {count}
          {suffix}
        </div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    )
  }

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
        showToast("Server responded with an error.", "error")
        return
      }

      const result = await response.json()
      showToast(result.message, "success")
      localStorage.setItem("userData", JSON.stringify(result.user))
      window.location.reload()
    } catch (error) {
      console.log("Invite removal failed")
      showToast("Failed to accept invite. Please try again.", "error")
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
        showToast("Server responded with an error.", "error")
        return
      }
      const result = await response.json()
      showToast(result.message, "success")
      localStorage.setItem("userData", JSON.stringify(result.reciever))
      console.log(JSON.parse(localStorage.getItem("userData")).invites)
      window.location.reload()
    } catch (error) {
      console.log("Invite removal failed")
      showToast("Failed to decline invite. Please try again.", "error")
    }
  }

  const toggleRoomsModal = () => {
    setIsRoomsModalOpen(!isRoomsModalOpen)
  }

  const handleFileUpload = async (roomId, file) => {
    const formData = new FormData()
    formData.append("roomImage", file) // must match multer's .single('roomImage')

    try {
      const response = await fetch(`http://localhost:5001/api/room/uploadRoomImage/${roomId}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        showToast("File upload failed.", "error")
        return
      }

      const result = await response.json()
      showToast("Image uploaded successfully!", "success")
    } catch (err) {
      console.error("Upload error:", err)
      showToast("There was an error uploading the file.", "error")
    }
  }

  // Toast notification system
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = "info") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])

    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }

  return (
    <div className={styles.dashboardAppContainer}>
      {/* Toast notifications */}
      <div className={styles.toastContainer}>
        {toasts.map((toast) => (
          <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
            <div className={styles.toastIcon}>
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✕"}
              {toast.type === "info" && "ℹ"}
            </div>
            <div className={styles.toastMessage}>{toast.message}</div>
          </div>
        ))}
      </div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.floatingShape} style={{ "--delay": "0s" }}></div>
        <div className={styles.floatingShape} style={{ "--delay": "2s" }}></div>
        <div className={styles.floatingShape} style={{ "--delay": "4s" }}></div>
        <div className={styles.floatingShape} style={{ "--delay": "6s" }}></div>
      </div>

      {/* Top navigation bar */}
      <div className={styles.dashboardBanner}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <h1 className={styles.logo}>RoomEase</h1>
            <div className={styles.headerGlow}></div>
          </div>
          <div className={styles.welcomeMessage}>
            Welcome back, <span className={styles.username}>{userData.username || "User"}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          {/* <button className={styles.actionButton} onClic>
            <Plus size={18} />
            <span className={styles.actionLabel}>New Room</span>
          </button> */}
          <NotificationBell />
          <AvatarButton />
        </div>
      </div>

      {/* Side navigation */}
      <div className={styles.dashboardLayout}>
        <div className={styles.sideNav}>
          <div className={styles.navItems}>
            <button
              className={`${styles.navItem} ${activeTab === "spaces" ? styles.active : ""}`}
              onClick={() => setActiveTab("spaces")}
            >
              <Home size={20} />
              <span>Spaces</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === "invites" ? styles.active : ""}`}
              onClick={() => setActiveTab("invites")}
            >
              <Users size={20} />
              <span>Invites</span>
              {Array.isArray(userData.invites) && userData.invites.length > 0 && (
                <span className={styles.badge}>{userData.invites.length}</span>
              )}
            </button>
            <button
              className={`${styles.navItem} ${activeTab === "settings" ? styles.active : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.contentHeading}>
            <h2>
              {activeTab === "spaces" ? "Your Spaces" : activeTab === "invites" ? "Room Invitations" : "Settings"}
            </h2>
            <div className={styles.contentDivider}></div>
            <p className={styles.subheading}>
              {activeTab === "spaces"
                ? "Manage and access your personal and shared living spaces"
                : activeTab === "invites"
                  ? "View and respond to your room invitations"
                  : "Customize your RoomEase experience"}
            </p>
          </div>

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {activeTab === "spaces" && (
                <div className={styles.tabContent}>
                  <div className={styles.roomsSection}>
                    <div className={styles.sectionHeader}>
                      <h3>Your Spaces</h3>
                      <button className={styles.viewAllButton} onClick={toggleRoomsModal}>
                        View All Rooms
                      </button>
                    </div>

                    <div className={styles.roomsGrid}>
                      {/* Always show the Room Creation Door */}
                      <div className={styles.roomWrapper}>
                        <RoomCreationDoor />
                      </div>

                      {/* Display the Master Room Door if there are more than 1 rooms */}
                      {Array.isArray(userData.rooms) && userData.rooms.length > 1 && (
                        <div className={styles.roomWrapper}>
                          <RoomDoor roomName="Master Room" onClick={() => navigate(`/room/master-room`)} />
                        </div>
                      )}

                      {/* Add the All Rooms button directly in the grid */}
                      {Array.isArray(userData.rooms) && userData.rooms.length > 0 && (
                        <div className={styles.roomWrapper}>
                          <div className={styles.roomCard} onClick={toggleRoomsModal}>
                            <div className={styles.roomCardContent}>
                              <div className={styles.roomIcon}>
                                <Briefcase size={24} />
                              </div>
                              <h3>All Your Rooms</h3>
                              <p className={styles.roomMeta}>
                                {userData.rooms.length} {userData.rooms.length === 1 ? "room" : "rooms"} available
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className={styles.statsSection + " " + styles.animateOnScroll} ref={statsRef}>
                    <h3 className={styles.sectionHeader}>Your Activity</h3>
                    <div className={styles.statsGrid}>
                      <Counter end={userData.rooms?.length || 0} label="Active Rooms" /> 
                      <Counter end={5} label="Tasks Completed" />
                      <Counter end={userData.invites?.length || 0} label="Pending Invites" />
                      <Counter end={12} label="Days Active" />
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className={styles.featuresSection + " " + styles.animateOnScroll}>
                    <h3 className={styles.sectionHeader}>RoomEase Features</h3>
                    <div className={styles.featuresGrid}>
                      <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>💰</div>
                        <h4>Expense Splitting</h4>
                        <p>Track and split bills and expenses with your roommates easily</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🧹</div>
                        <h4>Chore Management</h4>
                        <p>Assign, schedule, and track household chores</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🛒</div>
                        <h4>Grocery Lists</h4>
                        <p>Create shared shopping lists and track purchases</p>
                      </div>
                      <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔕</div>
                        <h4>Quiet Hours</h4>
                        <p>Schedule and notify roommates of quiet hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invites Tab Content */}
              {activeTab === "invites" && (
                <div className={styles.tabContent}>
                  {Array.isArray(userData.invites) && userData.invites.length > 0 ? (
                    <div className={styles.invitesGrid}>
                      {userData.invites.map((invite) => (
                        <div key={invite._id} className={styles.inviteCard}>
                          <div className={styles.inviteContent}>
                            <div className={styles.inviteIcon}>
                              <Users size={24} />
                            </div>
                            <div className={styles.inviteDetails}>
                              <h3>{invite.roomName}</h3>
                              <p>You've been invited to join this room</p>
                            </div>
                          </div>
                          <div className={styles.inviteActions}>
                            <button className={styles.acceptButton} onClick={() => acceptInvite({ invite })}>
                              Accept
                            </button>
                            <button className={styles.declineButton} onClick={() => declineInvite({ invite })}>
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyStateIcon}>
                        <Bell size={48} />
                      </div>
                      <h3>No Pending Invites</h3>
                      <p>You don't have any room invitations at the moment.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab Content */}
              {activeTab === "settings" && (
                <div className={styles.tabContent}>
                  <div className={styles.settingsSection}>
                    <div className={styles.settingsCard}>
                      <h3>Account Settings</h3>
                      <p className={styles.settingsDescription}>
                        Manage your profile information and account preferences
                      </p>
                      
                      <div className={styles.settingsSummary}>
                        <div className={styles.settingItem}>
                          <div className={styles.settingLabel}>Username</div>
                          <div className={styles.settingValue}>{userData.username || "Not set"}</div>
                        </div>
                        
                        <div className={styles.settingItem}>
                          <div className={styles.settingLabel}>Phone Number</div>
                          <div className={styles.settingValue}>
                            {userData.contactInfo 
                              ? String(userData.contactInfo).replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") 
                              : "Not set"}
                          </div>
                        </div>
                        
                        <div className={styles.settingItem}>
                          <div className={styles.settingLabel}>Birthday</div>
                          <div className={styles.settingValue}>
                            {userData.birthday 
                              ? userData.birthday.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3") 
                              : "Not set"}
                          </div>
                        </div>
                        
                        <div className={styles.settingItem}>
                          <div className={styles.settingLabel}>Chat Filter</div>
                          <div className={styles.settingValue}>
                            {userData.chatFilter ? "Enabled" : "Disabled"}
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className={styles.editProfileButton}
                        onClick={() => setIsProfileSettingsOpen(true)}
                      >
                        <User size={16} />
                        Edit Profile Settings
                      </button>
                    </div>

                    {/* <div className={styles.settingsCard}>
                      <h3>App Preferences</h3>
                      <div className={styles.settingsForm}>
                        <div className={styles.formGroup}>
                          <label>Theme</label>
                          <select className={styles.formSelect}>
                            <option>Dark (Default)</option>
                            <option>Light</option>
                            <option>System</option>
                          </select>
                        </div>
                        <div className={styles.formGroup}>
                          <label>Notifications</label>
                          <div className={styles.toggleGroup}>
                            <label className={styles.toggleLabel}>
                              <input type="checkbox" defaultChecked className={styles.toggleInput} />
                              <span className={styles.toggle}></span>
                              Email Notifications
                            </label>
                            <label className={styles.toggleLabel}>
                              <input type="checkbox" defaultChecked className={styles.toggleInput} />
                              <span className={styles.toggle}></span>
                              Push Notifications
                            </label>
                          </div>
                        </div>
                        <button className={styles.saveButton}>Save Preferences</button>
                      </div>
                    </div> */}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rooms Modal */}
      {isRoomsModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.roomsModal} id="rooms-modal" ref={modalRef}>
            <div className={styles.modalHeader}>
              <h3>All Your Rooms</h3>
              <button className={styles.closeButton} onClick={() => setIsRoomsModalOpen(false)}>
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              {/* Add search functionality */}
              <div className={styles.modalSearch}>
                {/* <Search size={16} className={styles.searchIcon} /> */}
                {/* <input type="text" placeholder="Search rooms..." className={styles.searchInput} /> */}
              </div>

              {userData.rooms && userData.rooms.length > 0 ? (
                userData.rooms.map((room) => (
                  <div key={room._id} className={styles.roomItem}>
                    <div className={styles.roomItemIcon}>
                      <Home size={22} />
                    </div>
                    <div className={styles.roomItemContent} onClick={() => getRoom(room._id)}>
                      <h4>{room.roomName}</h4>
                      {/* <p>{room.roomMembers?.length || 0} members</p> //length.? */}
                    </div>
                    <div className={styles.roomItemAction}>
                      <button className={styles.uploadButton}>
                        <label className={styles.uploadLabel}>
                          <input
                            type="file"
                            className={styles.hiddenFileInput}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleFileUpload(room._id, e.target.files[0])
                            }}
                          />
                          Upload Image
                        </label>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No rooms available. Create your first room to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {isProfileSettingsOpen && <ProfileSettings onClose={() => setIsProfileSettingsOpen(false)} />}

      <footer className={styles.footer}>
        <div className={styles.footerGlow}></div>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <h2 className={styles.footerLogo}>RoomEase</h2>
            <p>Simplifying roommate living since 2023</p>
          </div>
          <div className={styles.footerLinks}>
            <a href="/privacy-policy" className={styles.footerLink}>
              Privacy Policy
            </a>
            <span className={styles.footerDivider}>|</span>
            <a href="/terms-of-service" className={styles.footerLink}>
              Terms of Service
            </a>
            <span className={styles.footerDivider}>|</span>
            <a href="/help" className={styles.footerLink}>
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
