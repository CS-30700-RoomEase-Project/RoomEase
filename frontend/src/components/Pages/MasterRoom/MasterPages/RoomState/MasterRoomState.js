import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MasterRoomState.module.css';

function RoomStates() {
    console.log("RoomStates component rendered");
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [roomStates, setRoomStates] = useState([]);

    useEffect(() => {
        try {
            
        } catch (error) {
            console.error("Error parsing userData from localStorage:", error);
        }
    }, []);

    return (
        <div className={styles.roomStatesContainer}>
        <header className={styles.header}>
            <h1>Your Room States</h1>
        </header>
        <main className={styles.mainContent}>
            {roomStates.length > 0 ? (
            <div className={styles.roomGrid}>
                {roomStates.map((room) => (
                <div
                    key={room._id}
                    className={styles.roomCard}
                    onClick={() => navigate(`/room/${room._id}`)}
                >
                    <h3 className={styles.roomTitle}>{room.roomName || "Unnamed Room"}</h3>
                    <p className={styles.roomState}>
                    {room.state ? room.state : "No state info available."}
                    </p>
                </div>
                ))}
            </div>
            ) : (
            <p>No room state information available.</p>
            )}
        </main>
        <footer className={styles.footer}>
            <p>© 2025 RoomEase. All rights reserved.</p>
        </footer>
        </div>
    );
}

export default RoomStates;