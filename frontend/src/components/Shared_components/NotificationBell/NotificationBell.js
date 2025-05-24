import React, { useEffect, useState } from 'react';
// import { AiOutlineClose } from 'react-icons/ai'; // Ensure this is installed if you re-add it: npm install react-icons
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import './NotificationBell.css';
import bellIcon from './bell-icon.png'; // Make sure you have this image in the same directory or update the path

/**
 * Displays notifications when clicked and shows a count of notifications.
 * The popup is centered, modern, and mobile-friendly.
 * The trigger bell icon uses the original styling.
 * @returns Notification Bell component
 */
const NotificationBell = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifs, setNotifs] = useState([]); // Store notifications
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.error("No userId found in localStorage");
            setError("User not found. Please log in.");
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);
            try {
                // Replace with your actual API endpoint
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/getNotifications/${userId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotifs([]); // No notifications found
                    } else {
                        const errorData = await response.json().catch(() => ({ message: "Failed to fetch notifications" }));
                        throw new Error(errorData.message || "Failed to fetch notifications");
                    }
                } else {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotifs(sortedData);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError(error.message || "Failed to load notifications.");
            }
            setLoading(false);
        };

        fetchNotifications();
    }, []); // Consider re-fetching if userId changes or on some other trigger

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleGoToNotifications = () => {
        navigate("/Notifications"); // Make sure you have a /Notifications route
        closeModal();
    };

    const BellIconComponent = () => (
      <img
          src={bellIcon} // This should be the path to your original bell icon
          alt="Notification Bell"
          className="bell-icon" // Changed from bell-icon-img
      />
    );


    return (
        <div>
            {/* Changed className here to use original styling */}
            <div className="notification-bell" onClick={openModal}>
                <BellIconComponent />
                {notifs.length > 0 && (
                    // Changed className here
                    <span className="notification-count">{notifs.length > 99 ? '99+' : notifs.length}</span>
                )}
            </div>

            <Popup
                open={isOpen}
                modal
                nested
                onClose={closeModal}
                contentStyle={{
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0'
                }}
                overlayStyle={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                closeOnDocumentClick={true}
            >
                {(close) => (
                    <div className="modern-popup-content">
                        <button className="popup-close-button" onClick={close}>
                            {/* If you want a close icon, uncomment AiOutlineClose import and usage */}
                            {/* <AiOutlineClose size={24} /> */}
                            {/* Using a simple 'X' for now if react-icons is not used */}
                            X
                        </button>
                        <div className="popup-header">
                            <h2>Notifications</h2>
                        </div>
                        <div className="popup-body">
                            {loading ? (
                                <p className="popup-message">Loading notifications...</p>
                            ) : error ? (
                                <p className="popup-message error-text">{error}</p>
                            ) : notifs.length === 0 ? (
                                <p className="popup-message">No new notifications.</p>
                            ) : (
                                <ul className="notifications-list">
                                    {notifs.slice(0, 5).map((notif) => (
                                        <li key={notif._id || notif.id} className="notification-item">
                                            <div className="notification-item-icon">
                                                <span>🔔</span>
                                            </div>
                                            <div className="notification-item-content">
                                                <p className="notification-description">{notif.notificationType}</p>
                                                {notif.createdAt && (
                                                    <p className="notification-time">
                                                        {new Date(notif.createdAt).toLocaleTimeString()} - {new Date(notif.createdAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="popup-footer">
                            {notifs.length > 5 && (
                                <button onClick={handleGoToNotifications} className="popup-action-button view-all-button">
                                    View All Notifications
                                </button>
                            )}
                            {notifs.length === 0 && !loading && !error && (
                                 <button onClick={handleGoToNotifications} className="popup-action-button view-all-button">
                                    View Notification History
                                </button>
                            )}
                             {notifs.length > 0 && notifs.length <= 5 && (
                                <button onClick={handleGoToNotifications} className="popup-action-button view-all-button">
                                    Go To Notifications Page
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
};

export default NotificationBell;