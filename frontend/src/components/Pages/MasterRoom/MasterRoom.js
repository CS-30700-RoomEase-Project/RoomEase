import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import ExitRoom from '../Room/Room Icons/ExitRoom';
import BulletinBoard from "../Room/Room Items/BulletinBoard";
import ChoreItems from '../Room/Room Items/ChoreItems';
import Computer from '../Room/Room Items/Computer';
import Desk from '../Room/Room Items/Desk';
import Fridge from '../Room/Room Items/Fridge';

import BulletinPopup from '../../Shared_components/BulletinPopup/BulletinPopup';
import NotesPopup from "../../Shared_components/BulletinPopup/NotesPopup";
import style from './MasterRoom.module.css';

function MasterRoom() {
    const navigate = useNavigate();

    const [showBulletin, setShowBulletin] = useState(false);
    const [showNotesPopup, setShowNotesPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState({});

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
                    setUserData(data);
                } catch (err) {
                    console.error("Error fetching userData:", err);
                    setError(err.message);
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
    }, []);

    const handleGoToChores = () => {
        navigate(`/chores/master-room`);
    };

    const handleGoToState = () => {
        navigate(`/master-room/room-state`);
    };

    const handleGoToDisputes = () => {
        navigate(`/disputes/1`);
    };

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
                    <h1 className={style.roomTitle}>Master Room</h1>
                    <div className={style.roomBannerMini}>
                        <Avatar />
                    </div>
                </div>

                <div className={style.roomBackground}>
                    <div className={style.upperSection}>
                        <div className={style.upperLeft}>
                            {/* Removed Fridge from upper section */}
                        </div>
                        <div className={style.upperMiddle}>
                            <BulletinBoard onClick={handleBulletinClick} enabled={true} />
                        </div>
                        <div className={style.upperRight}>
                            {/* Removed ChoreItems from upper section */}
                        </div>
                    </div>

                    <div className={style.floorItems}>
                        <div className={style.floorLeft}>
                            <Fridge room={null} enabled={true} />
                        </div>
                        <div className={style.floorMiddle}>
                            <Desk gavelVisible={false}>
                                <Computer
                                    handleSettingsClick={() => {}}
                                    handleInviteClick={() => {}}
                                    roomId={"master-room"}
                                    roomData={null}
                                />
                            </Desk>
                        </div>
                        <div className={style.floorRight}>
                            <ChoreItems onClick={handleGoToChores} enabled={true} />
                        </div>
                    </div>
                </div>

                <div className={style.roomFloor} />
            </div>

            <BulletinPopup
                isOpen={showBulletin}
                onClose={() => setShowBulletin(false)}
                settings={[false, false, true]}
                roomId={1}
                onOpenNotes={() => setShowNotesPopup(true)}
            />

            <NotesPopup
                room={null}
                isOpen={showNotesPopup}
                onClose={() => setShowNotesPopup(false)}
                initialNotes={null}
            />
        </>
    );
}

export default MasterRoom;
