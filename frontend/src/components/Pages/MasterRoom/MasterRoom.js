import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../Shared_components/AvatarButton/AvatarButton';
import ExitRoom from '../Room/Room Icons/ExitRoom';
import BulletinBoard from "../Room/Room Items/BulletinBoard";
import ChoreItems from "../Room/Room Items/ChoreItems";
import Computer from '../Room/Room Items/Computer';
import Desk from '../Room/Room Items/Desk';
import Fridge from '../Room/Room Items/Fridge';

import BulletinPopup from '../../Shared_components/BulletinPopup/BulletinPopup';
import NotesPopup from "../../Shared_components/BulletinPopup/NotesPopup";
import CosmeticStorePopup from '../Room/CosmeticStorePopup';
import style from './MasterRoom.module.css';

// Tooltip wrapper for visible hover labels
function Tooltip({ label, children }) {
  return (
    <div className={style.tooltipWrapper}>
      {children}
      <span className={style.tooltipText}>{label}</span>
    </div>
  );
}

function MasterRoom() {
  const navigate = useNavigate();

  // Room selection state
  const [selectedRoomId, setSelectedRoomId] = useState('');

  // UI state
  const [showBulletin, setShowBulletin] = useState(false);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Aesthetics state
  const [cosmeticData, setCosmeticData] = useState({ selected: [] });
  const [points, setPoints] = useState(0);
  const [cosmeticPopupOpen, setCosmeticPopupOpen] = useState(false);

  // Room-selector popup state
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const stored = localStorage.getItem('userData');
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
      } catch (err) {
        console.error('Error parsing userData from storage:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Set default selected room once userData loads
  useEffect(() => {
    if (userData?.rooms?.length) {
      setSelectedRoomId(userData.rooms[0]._id);
    }
  }, [userData]);

  // Fetch cosmetics when userData or selectedRoomId changes
  useEffect(() => {
    if (!userData || !selectedRoomId) return;
    const fetchCosmetics = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/room/getCosmetic?roomId=${selectedRoomId}&userId=${userData.userId}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' } }
        );
        if (!response.ok) throw new Error(`Cosmetic fetch error: ${response.status}`);
        const { cosmetic, totalPoints } = await response.json();
        setCosmeticData(cosmetic);
        setPoints(totalPoints);
      } catch (err) {
        console.error('Error fetching cosmetics:', err);
      }
    };
    fetchCosmetics();
  }, [userData, selectedRoomId]);

  // Apply custom colors to CSS variables
  useEffect(() => {
    if (!Array.isArray(cosmeticData.selected)) return;
    const keys = ['fridge','table','computer','trash','board','clock','gavel','background'];
    keys.forEach((key, i) => {
      const color = cosmeticData.selected[i];
      if (color && color !== 'default') {
        document.documentElement.style.setProperty(`--${key}-color`, color);
      } else {
        document.documentElement.style.removeProperty(`--${key}-color`);
      }
    });
  }, [cosmeticData]);

  const handleGoToChores = () => navigate('/chores/master-room');
  const handleBulletinClick = () => setShowBulletin(true);

  const handlePurchase = async (color) => {
    const stored = localStorage.getItem('userData');
    if (!stored) return;
    const { userId } = JSON.parse(stored);
    try {
      const response = await fetch(
        'http://localhost:5001/api/room/purchaseColor',
        { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId, roomId: selectedRoomId, color }) }
      );
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
    const stored = localStorage.getItem('userData');
    if (!stored) return;
    const { userId } = JSON.parse(stored);
    try {
      const response = await fetch(
        'http://localhost:5001/api/room/selectColor',
        { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId, roomId: selectedRoomId, index, color }) }
      );
      if (!response.ok) throw new Error('Select color failed');
      const updated = await response.json();
      setCosmeticData(updated.cosmetic);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className={style.appContainer}>
        <div className={style.roomBanner}>
          <ExitRoom onClick={() => navigate('/dashboard')} />
          <h1 className={style.roomTitle}>Master Room</h1>
          <div className={style.roomBannerMini}><Avatar /></div>
        </div>
        <div className={style.roomBackground}>
          <div className={style.upperSection}>
            <div className={style.upperLeft} />
            <div className={style.upperMiddle}>
              <Tooltip label="Bulletin Board">
                <BulletinBoard onClick={handleBulletinClick} enabled />
              </Tooltip>
            </div>
            <div className={style.upperRight}>
              <div className={style.roomDialWrapper}>
                <div className={style.rope} />
                <Tooltip label="Cosmetics">
                  <div className={style.roomDial} onClick={() => setShowRoomSelector(true)} />
                </Tooltip>
              </div>
            </div>
          </div>
          <div className={style.floorItems}>
            <div className={style.floorLeft}>
              <Tooltip label="Groceries">
                <Fridge enabled />
              </Tooltip>
            </div>
            <div className={style.floorMiddle}>
              <Tooltip label="Bills">
                <Desk
                  gavelVisible={false}
                  computer={<Computer handleSettingsClick={() => {}} handleInviteClick={() => {}} roomId="master-room" roomData={userData} />}
                />
              </Tooltip>
            </div>
            <div className={style.floorRight}>
              <Tooltip label="Chores">
                <ChoreItems onClick={handleGoToChores} enabled />
              </Tooltip>
            </div>
          </div>
        </div>
        <div className={style.roomFloor} />
      </div>

      {/* Popups */}
      <BulletinPopup isOpen={showBulletin} onClose={() => setShowBulletin(false)} settings={[false,false,true]} roomId={1} onOpenNotes={() => setShowNotesPopup(true)} />
      <NotesPopup room={null} isOpen={showNotesPopup} onClose={() => setShowNotesPopup(false)} initialNotes={null} />
      <CosmeticStorePopup isOpen={cosmeticPopupOpen} onClose={() => setCosmeticPopupOpen(false)} cosmetics={cosmeticData} totalPoints={points} onPurchase={handlePurchase} onSelect={handleSelect} />

      {/* Room selector popup */}
      {showRoomSelector && (
        <div className={style.roomSelectOverlay} onClick={() => setShowRoomSelector(false)}>
          <div className={style.roomSelectPopup} onClick={e => e.stopPropagation()}>
            <h2 className={style.popupTitle}>Choose a room for cosmetics</h2>
            <select className={style.popupSelect} value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)}>
              {userData.rooms.map(room => <option key={room._id} value={room._id}>{room.roomName}</option>)}
            </select>
            <button className={style.popupOpen} onClick={() => { setCosmeticPopupOpen(true); setShowRoomSelector(false); }}>Confirm</button>
            <button className={style.popupClose} onClick={() => setShowRoomSelector(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default MasterRoom;