import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import './NotificationBell.css';
import bellIcon from './bell-icon.png';

/**
 * TODO: display notifications when clicked and display a true count of notifications
 * @returns Notification Bell component with a count of notifications
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

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleGoToNotifications = () => {
        navigate("/Notifications");
    };
    
    return (
        <div>
            
            <Popup 
                trigger={
                    <div className="notification-bell">
                        <img 
                            src={bellIcon} 
                            alt="Notification Bell" 
                            className="bell-icon" 
                            onClick={toggleDropdown}
                        />
                        <span className="notification-count">{notifs.length}</span>
                    </div>
                } 
                arrow={false} 
                position="bottom" 
                on="click" 
                open={isOpen} 
                closeOnDocumentClick
                >
                <div className='dropdown'>
                    <button onClick={handleGoToNotifications} className='dropdownItem'>Go To Notifications</button>
                    <div className='notificationsContainer'>
                        {/* <h2>Notifications</h2> */}
                        {loading ? (
                            <p>Loading notifications...</p>
                        ) : error ? (
                            <p className='errorText'>{error}</p>
                        ) : notifs.length === 0 ? (
                            <p>No notifications available.</p>
                        ) : (
                            <ul>
                                {notifs.map((notif) => (
                                    <li key={notif._id} className='notificationItem'>
                                        <span>{notif.description}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default NotificationBell;