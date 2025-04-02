import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import ExitRoom from '../Room/Room Icons/ExitRoom';
import BulletinBoard from "../Room/Room Items/BulletinBoard";
import ChoreItems from '../Room/Room Items/ChoreItems';
import Clock from '../Room/Room Items/Clock';
import Computer from '../Room/Room Items/Computer';
import Desk from '../Room/Room Items/Desk';
import Fridge from '../Room/Room Items/Fridge';
import Gavel from '../Room/Room Items/Gavel';

import style from './MasterRoom.module.css';
import BulletinPopup from '../../Shared_components/BulletinPopup/BulletinPopup';

function MasterRoom() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});

    // Fetch and update user data from the server upon opening or refreshing the page
    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);

                    const response = await fetch(`http://localhost:5001/api/users/getUser?userId=${parsedUser.userId}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });
        
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.status}`);
                    }
        
                    const data = await response.json();
                } catch (err) {
                    console.error("Error parsing stored userData:", err);
                }
            }
        };

        (async () => {
            try {
                await fetchUserData();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []); // This effect runs once on mount

    const handleGoToChores = (roomId) => {
        // navigate(`/chores/${roomId}`);
    }
    
    const handleGoToHours = (roomId) => {
        // navigate(`/quiet-hours/${roomId}`);
    }
    
    const handleGoToState = (roomId) => {
        // navigate(`/room-state/${roomId}`);
    }

    const handleGoToDisputes = (roomId) => {
        // navigate(`/disputes/${roomId}`);
    }

    const handleBulletinClick = () => {
        //setShowBulletin(true);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={style.appContainer}>
            <div className={style.roomBanner}>
                <ExitRoom onClick={() => navigate('/dashboard')} />
                <h1 className={style.roomTitle}>Master Room</h1>
                {/* <Message onClick={() => handleGoToState(roomId)/> */}
                <div className={style.roomBannerMini}>
                    <Avatar />
                </div> 
            </div>
            

            <div className={style.roomBackground}>
                {/* <Fridge 
                    room={null}
                    enabled={true}
                /> */}
                <Desk>
                    <Computer 
                        handleSettingsClick={() => {}}
                        handleInviteClick={() => {}}
                        roomId={"master-room"} // Indicates that this is the master room
                        roomData={null} // Indicates that this is the master room
                    />
                    <Gavel onClick={() => handleGoToDisputes(1)} enabled={true} />
                </Desk>
                {/* <Clock onClick={() => handleGoToState(1)} enabled={true} /> */}
                {/* <BulletinBoard 
                    onClick={handleGoToHours}
                /> */}

                {/* <ChoreItems 
                    onClick={() => handleGoToChores(1)}
                    enabled={true}
                /> */}
            </div>
            <div className={style.roomFloor}/>
        </div>
    )
};

export default MasterRoom;