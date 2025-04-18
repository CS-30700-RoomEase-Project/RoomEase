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
  const [userData, setUserData] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const stored = localStorage.getItem('userData');
      if (!stored) return;
      try {
        const { userId } = JSON.parse(stored);
        const res = await fetch(
          `http://localhost:5001/api/users/getUser?userId=${userId}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching userData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleGoToChores = () => navigate('/chores/master-room');
  const handleBulletinClick = () => setShowBulletin(true);

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
            <div className={style.upperLeft} />
            <div className={style.upperMiddle}>
              <BulletinBoard onClick={handleBulletinClick} enabled={true} />
            </div>
            <div className={style.upperRight} />
          </div>

          <div className={style.floorItems}>
            <div className={style.floorLeft}>
              <Fridge room={null} enabled={true} />
            </div>
            <div className={style.floorMiddle}>
              <Desk
                gavelVisible={false}
                computer={
                  <Computer
                    handleSettingsClick={() => {}}
                    handleInviteClick={() => {}}
                    roomId="master-room"
                    roomData={userData}
                  />
                }
              />
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
