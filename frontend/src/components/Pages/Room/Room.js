import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Room.css';
import Fridge from './Room Items/Fridge';
import Desk from './Room Items/Desk';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import Computer from './Room Items/Computer';
import Clock from './Room Items/Clock';
import BulletinBoard from './Room Items/BulletinBoard';
import TrashCan from './Room Items/TrashCan';
import Broom from './Room Items/Broom';
import NotificationButton from '../../Shared_components/NotificationBell/NotificationBell';

function Room() {
    const { roomId } = useParams(); // Gets the roomId from the URL

    const navigate = useNavigate();
    console.log("Room");
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {   
        const userData = JSON.parse(localStorage.getItem('userData'));
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
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [roomId, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    console.log(roomData);
    return (
        <div className='appContainer'>
            <div className='roomBanner'>
                <h1 className='roomTitle'>{roomData.roomName}</h1>
                <Avatar />
            </div>
            <div className={'roomBackground'}>
                <Fridge room={roomData}/>
                <Desk>
                    <Computer />
                </Desk>
                <Clock />
                <BulletinBoard />
                <TrashCan />
                <Broom />
            </div>
            <div className={'roomFloor'}/>
        </div>
    )
};

export default Room;