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
import CosmeticStorePopup from './CosmeticStorePopup';

function Room() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [showBulletin, setShowBulletin] = useState(false);
    const [showNotesPopup, setShowNotesPopup] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setusername] = useState(null);
    const [cosmetics, setCosmetics] = useState(null);
    const [cosmeticPopupOpen, setCosmeticPopupOpen] = useState(false);
    const [cosmeticData, setCosmeticData] = useState({});
    const [points, setPoints] = useState(0);


    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setusername(userData?.username);

        if (!userData?.userId) {
            navigate('/login');
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
                localStorage.setItem('roommates', JSON.stringify(data.room.roomMembers));
                console.log("roomData:", data);
                setRoomData(data.room);
                console.log("roomData2:",roomData);
                const storedUser = localStorage.getItem("userData");
                const parsedUser = JSON.parse(storedUser);
                const currentUserId = parsedUser._id;
                console.log(currentUserId);
                setPoints(data.room.points[currentUserId]);
                console.log("points:",points);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchCosmetics = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/room/getCosmetic?roomId=${roomId}&userId=${userData.userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error(`Cosmetic fetch error: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.cosmetic);
                await setCosmeticData(data.cosmetic);
                console.log("Fetched cosmetics:", data.cosmetic);
                console.log("cosmeticData:", cosmeticData);
            } catch (err) {
                console.error("Error fetching cosmetics:", err);
            }
        };

        fetchRoomData();
        fetchCosmetics();
    }, [roomId, navigate]);

    useEffect(() => {
        if (!cosmeticData || !Array.isArray(cosmeticData.selected)) return;
    
        const applyRoomColors = (selectedArray) => {
            const keys = ['fridge', 'table', 'computer', 'trash', 'board', 'clock', 'gavel', 'background'];
    
            keys.forEach((key, i) => {
                const color = selectedArray[i];
                if (color && color !== 'default') {
                    document.documentElement.style.setProperty(`--${key}-color`, color);
                } else {
                    document.documentElement.style.removeProperty(`--${key}-color`);
                }
            });
        };
    
        applyRoomColors(cosmeticData.selected);
    }, [cosmeticData]);
    
    

    const handlePurchase = async (color) => {
        const userData = JSON.parse(localStorage.getItem('userData'));
    
        try {
            const response = await fetch('http://localhost:5001/api/room/purchaseColor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData._id,
                    roomId,
                    color
                })
            });
    
            if (!response.ok) throw new Error('Purchase failed');
    
            const updated = await response.json();
            setCosmeticData(updated.cosmetic);
            setPoints(updated.totalPoints);
        } catch (err) {
            console.error(err);
            alert('Not enough points or purchase failed');
        }
    };

    const handleSelect = async (index, color) => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        console.log(color);
        console.log(index);
    
        try {
            const response = await fetch('http://localhost:5001/api/room/selectColor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userData._id,
                    roomId,
                    index,
                    color
                })
            });
    
            if (!response.ok) throw new Error('Failed to select color');
    
            const updated = await response.json();
            setCosmeticData(updated.cosmetic);
        } catch (err) {
            console.error(err);
        }
    };
    

    const handleInviteClick = () => {
        navigate(`/room/${roomId}/invite`);
    };

    const handleSettingsClick = () => {
        navigate(`/room/${roomId}/settings`);
    };

    const handleGoToChores = (roomId) => {
        console.log("Navigating to chores with roomId:", roomId);
        navigate(`/chores/${roomId}`);
    };

    const handleGoToState = (roomId) => {
        console.log("Navigating to state with roomId:", roomId);
        navigate(`/room-state/${roomId}`);
    };

    const handleGoToDisputes = (roomId) => {
        if (roomData.settings[2]) {
            console.log("Navigating to disputes with roomId:", roomId);
            navigate(`/disputes/${roomId}`);
        }
    };

    const handleBulletinClick = () => {
        if (roomData.settings[3] || roomData.settings[9] || roomData.settings[8]) {
            setShowBulletin(true);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className={style.appContainer}>
                <div className={style.roomBanner}>
                    <ExitRoom onClick={() => navigate('/dashboard')} />
                    <button onClick={() => setCosmeticPopupOpen(true)}>Open Cosmetic Store</button>
                    <h1 className={style.roomTitle}>{roomData.roomName}</h1>
                    <div className={style.roomBannerMini}>
                        {roomData.settings[7] && (<RateButton />)}
                        {roomData.settings[6] && (<GroupChat roomId={roomId} userName={username} />)}
                        <Avatar />
                    </div>
                </div>

                <div className={style.roomBackground}>
                    <Fridge room={roomData} enabled={roomData.settings[0]} />
                    <Desk gavelVisible={true}>
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
                        enabled={roomData.settings[3] || roomData.settings[9] || roomData.settings[8]}
                    />
                    <ChoreItems
                        onClick={() => handleGoToChores(roomId)}
                        enabled={roomData.settings[5]}
                    />
                </div>

                <div className={style.roomFloor} />
            </div>

            <BulletinPopup
                isOpen={showBulletin}
                onClose={() => setShowBulletin(false)}
                settings={[roomData.settings[3], roomData.settings[9], roomData.settings[8]]}
                roomId={roomId}
                onOpenNotes={() => setShowNotesPopup(true)}
            />

            <NotesPopup
                room={roomData}
                isOpen={showNotesPopup}
                onClose={() => setShowNotesPopup(false)}
                initialNotes={roomData.bulletinNotes}
            />
            <CosmeticStorePopup
                isOpen={cosmeticPopupOpen}
                onClose={() => setCosmeticPopupOpen(false)}
                cosmetics={cosmeticData}
                totalPoints={points}
                onPurchase={handlePurchase}
                onSelect={handleSelect}
            />
        </>
    );
}

export default Room;
