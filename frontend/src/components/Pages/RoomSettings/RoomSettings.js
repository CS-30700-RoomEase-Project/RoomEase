import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from "./RoomSettings.module.css";


function RoomSettings() {
    const { roomId } = useParams(); // Gets the roomId from the URL
    const [roomData, setRoomData] = useState(null);
    const [userID, setUserID] = useState(null);

    const navigate = useNavigate(); 

    useEffect(() => {   
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUserID(userData.userId);
        console.log(userData);


        if (!userData?.userId) {
            navigate('/login'); // Redirect if no user data
            return;
        }

        const fetchRoomData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/room/getRoom?roomId=${roomId}&userId=${userData.userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                setRoomData(data.room);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchRoomData();
    }, [roomId, navigate]);


    const handleRoomLeave = () => {
        const leaveRoom = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/room/leaveRoom?roomId=${roomId}&userId=${userID}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                localStorage.setItem('userData', JSON.stringify(data.userData)); // Update user data in local storage
                console.log(data.userData);
                localStorage.setItem('roomData', JSON.stringify(data.roomData)); // Update room data in local storage
                console.log(data.message);
            } catch (err) {
                console.error(err.message);
            }
        };
        console.log("Leaving room with ID:", roomId); // Debugging
        leaveRoom();
        console.log("done leaving room"); // Debugging
        navigate("/dashboard");
    }

    return (
        <div>
            <h1>Room Settings</h1>
            <div className={style.leaveRoomButton} onClick={handleRoomLeave}><p>Leave Room</p></div>
        </div>
    );
}

export default RoomSettings;