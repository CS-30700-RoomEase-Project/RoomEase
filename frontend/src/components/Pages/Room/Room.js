import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Room.module.css';
import Fridge from './Room Items/Fridge';
import Desk from './Room Items/Desk';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import Computer from './Room Items/Computer';
import Clock from './Room Items/Clock';
import BulletinBoard from './Room Items/BulletinBoard';
import TrashCan from './Room Items/TrashCan';
import Broom from './Room Items/Broom';
import NotificationButton from '../../Shared_components/NotificationBell/NotificationBell';
import ExitRoom from './Room Icons/ExitRoom';
import ChoreItems from './Room Items/ChoreItems';
import { Table } from 'lucide-react';


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


    /* Functions to handle launching the invite page and settings page */
    const handleInviteClick = () => {
        navigate(`/room/${roomId}/invite`);
    };

    const handleSettingsClick = () => {
        navigate(`/room/${roomId}/settings`);
    };

    const handleGoToChores = (roomId) => {
        console.log("Navigating to chores with roomId:", roomId); // Debugging
        navigate(`/chores/${roomId}`);
    }
    
    const handleGoToHours = (roomId) => {
        console.log("Navigating to quiet-hours with roomId:", roomId); // Debugging
        navigate(`/quiet-hours/`);
    }
    
    const handleGoToState = (roomId) => {
        console.log("Navigating to state with roomId:", roomId); // Debugging
        navigate(`/room-state/`);
    }

    const handleGoToDisputes = (roomId) => {
        console.log("Navigating to disputes with roomId:", roomId); // Debugging
        navigate(`/disputes/`);
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    console.log(roomData);
    return (
        <div className={style.appContainer}>
            <div className={style.roomBanner}>
                <ExitRoom onClick={() => navigate('/dashboard')} />
                <h1 className={style.roomTitle}>{roomData.roomName}</h1>
                <Avatar />
            </div>
            <div className={style.roomBackground}>
                <Fridge room={roomData}/>
                <Desk>
                    <Computer handleInviteClick={handleInviteClick} handleSettingsClick={handleSettingsClick} roomId={roomData._id} />
                </Desk>
                <Clock onClick={() => handleGoToState(roomId)}/>
                <BulletinBoard onClick={() => handleGoToHours(roomId)}/>
                <ChoreItems onClick={() => handleGoToChores(roomId)}/>
                
                {/* <Gavel onClick = {() => handleGoToDisputes(roomId)}/> */}
            </div>
            <div className={style.roomFloor}/>
        </div>
    )
};

export default Room;