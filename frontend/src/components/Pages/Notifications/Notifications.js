import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Notifications.module.css";

function Notifications() {
    const navigate = useNavigate();
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
            try {
                const response = await fetch(`http://localhost:5001/api/notifications/getNotifications/${userId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotifs([]); // No notifications found, set empty array
                    } else {
                        throw new Error("Failed to fetch notifications");
                    }
                } else {
                    const data = await response.json();
                    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setNotifs(sortedData);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError("Failed to load notifications.");
            }
            setLoading(false);
        };

        fetchNotifications();
    }, []);

    const handleGoToDashboard = () => {
        navigate("/Dashboard");
    };

    const handleVisit = (notif) => {
        navigate(notif.pageID);
    } 

    const handleDelete = async (notif) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.error("No userId found in localStorage");
            setError("User not found. Please log in.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/notifications/removeNotification/${userId}/${notif._id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete notification");
            }

            // Remove the notification from the state
            setNotifs(notifs.filter((n) => n._id !== notif._id));

            alert("Notification removed successfully.");
        } catch (error) {
            console.error("Error deleting notification:", error);
            setError("Failed to delete notification.");
        }
    };

    return (
        <div className={styles.notificationsSheet}>
            <div className={styles.notificationsContainer}>
                <h2>Notifications</h2>
                {loading ? (
                    <p>Loading notifications...</p>
                ) : error ? (
                    <p className={styles.errorText}>{error}</p>
                ) : notifs.length === 0 ? (
                    <p>No notifications available.</p>
                ) : (
                    <ul>
                        {notifs.map((notif) => (
                            <li key={notif._id} className={styles.notificationItem}>
                                <span>{notif.description}</span>
                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleVisit(notif)}
                                    >
                                        Go To
                                    </button>
                                    <button
                                        className={styles.actionButton}
                                        onClick={() => handleDelete(notif)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <button className={styles.backButton} onClick={handleGoToDashboard}>
                Return to Dashboard
            </button>
        </div>
    );
}

export default Notifications;
