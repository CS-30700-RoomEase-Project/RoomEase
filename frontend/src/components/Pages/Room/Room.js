import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import GroupChat from '../../Shared_components/Messages/GroupChat';
import RateButton from '../../Shared_components/RoomRating/RateButton';
import ExitRoom from './Room Icons/ExitRoom';
import BulletinBoard from './Room Items/BulletinBoard';
import ChoreItems from './Room Items/ChoreItems';
import Clock from './Room Items/Clock';
import Computer from './Room Items/Computer';
import Desk from './Room Items/Desk';
import Fridge from './Room Items/Fridge';
import Gavel from './Room Items/Gavel';

import style from './Room.module.css';
import BulletinPopup from '../../Shared_components/BulletinPopup/BulletinPopup';
import NotesPopup from "../../Shared_components/BulletinPopup/NotesPopup";

function Room() {
    const { roomId } = useParams(); // Gets the roomId from the URL
    const navigate = useNavigate();

    const [showBulletin, setShowBulletin] = useState(false);
    const [showNotesPopup, setShowNotesPopup] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setusername] = useState(null);
    useEffect(() => {   
        const userData = JSON.parse(localStorage.getItem('userData'));
        setusername(userData.username);
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
                localStorage.setItem('roommates', "");                localStorage.setItem('roommates', "");
                localStorage.setItem('roommates', JSON.stringify(data.room.roomMembers)); // Store room data in local storage                localStorage.setItem('roommates', JSON.stringify(data.room.roomMembers)); // Store room data in local storage
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

    const handleGoToState = (roomId) => {
        console.log("Navigating to state with roomId:", roomId); // Debugging
        navigate(`/room-state/${roomId}`);
    }

    const handleGoToDisputes = (roomId) => {
        if (roomData.settings[2]) {
            console.log("Navigating to disputes with roomId:", roomId); // Debugging
            navigate(`/disputes/${roomId}`);
        }
    }

    const handleBulletinClick = () => {
        setShowBulletin(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
        <div className={style.appContainer}>
            <div className={style.roomBanner}>
                <ExitRoom onClick={() => navigate('/dashboard')} />
                <h1 className={style.roomTitle}>{roomData.roomName}</h1>
                {/* <Message onClick={() => handleGoToState(roomId)/> */}
                <div className={style.roomBannerMini}>
                    {roomData.settings[7] && (<RateButton/>)}
                    {roomData.settings[6] && (<GroupChat roomId={roomId} userName={username}/>)}
                    <Avatar />
                </div> 
            </div>


            <div className={style.roomBackground}>
                <Fridge 
                    room={roomData}
                    enabled={roomData.settings[0]}
                />
                <Desk>
                    <Computer 
                        
                        handleInviteClick={handleInviteClick} 
                        handleSettingsClick={handleSettingsClick} 
                        roomId={roomData._id}
                        roomData={roomData}
                    />
                    <Gavel onClick={() => handleGoToDisputes(roomId)} enabled={roomData.settings[2]} />
                </Desk>
                <Clock onClick={() => handleGoToState(roomId)} enabled={roomData.settings[4]} />
                <BulletinBoard 
                    onClick={handleBulletinClick}
                />

                <ChoreItems 
                    onClick={() => handleGoToChores(roomId)}
                    enabled={roomData.settings[5]}
                />
            </div>
            <div className={style.roomFloor}/>
        </div>
        <BulletinPopup isOpen={showBulletin} onClose={() => setShowBulletin(false)} settings={roomData.settings} roomId={roomId} onOpenNotes={() => setShowNotesPopup(true)} />
        <NotesPopup
            room={roomData}
            isOpen={showNotesPopup}
            onClose={() => setShowNotesPopup(false)}
            initialNotes={roomData.bulletinNotes}
        />
        </>
    )
};

export default Room;