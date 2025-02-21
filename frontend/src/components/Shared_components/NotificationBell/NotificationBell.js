import React from 'react';
import './NotificationBell.css';
import bellIcon from './bell-icon.png'; 

/**
 * TODO: display notifications when clicked and display a true count of notifications
 * @returns Notification Bell component with a count of notifications
 */
const NotificationBell = () => {
    return (
        <div className="notification-bell">
            <img src={bellIcon} alt="Notification Bell" className="bell-icon" />
            <span className="notification-count">3</span>
        </div>
    );
};

export default NotificationBell;