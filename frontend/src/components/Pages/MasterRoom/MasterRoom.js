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
  const [selectedRoomId, setSelectedRoomId] = useState('master-room');
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  // UI state
  const [showBulletin, setShowBulletin] = useState(false);
  const [showNotesPopup, setShowNotesPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Cosmetic store state
  const [cosmeticData, setCosmeticData] = useState({ selected: [] });
  const [points, setPoints] = useState(0);
  const [cosmeticPopupOpen, setCosmeticPopupOpen] = useState(false);

  // Aesthetics state
  const [bannerColor, setBannerColor] = useState('');
  const [roomBgColor, setRoomBgColor] = useState('');
  const [showTemporaryPopup, setShowTemporaryPopup] = useState(false);

  // --- Persisted colors: load saved values on room change ---
  useEffect(() => {
    const savedBanner = localStorage.getItem(`${selectedRoomId}-bannerColor`);
    const savedOverlay = localStorage.getItem(`${selectedRoomId}-roomBgColor`);
    if (savedBanner) setBannerColor(savedBanner);
    if (savedOverlay) setRoomBgColor(savedOverlay);
  }, [selectedRoomId]);

  // --- Persisted colors: save bannerColor whenever it changes ---
  useEffect(() => {
    if (bannerColor) {
      localStorage.setItem(`${selectedRoomId}-bannerColor`, bannerColor);
    } else {
      localStorage.removeItem(`${selectedRoomId}-bannerColor`);
    }
  }, [selectedRoomId, bannerColor]);

  // --- Persisted colors: save roomBgColor whenever it changes ---
  useEffect(() => {
    if (roomBgColor) {
      localStorage.setItem(`${selectedRoomId}-roomBgColor`, roomBgColor);
    } else {
      localStorage.removeItem(`${selectedRoomId}-roomBgColor`);
    }
  }, [selectedRoomId, roomBgColor]);

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

  // Fetch cosmetics whenever userData or selectedRoomId changes
  useEffect(() => {
    if (!userData) return;
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
    const keys = ['fridge', 'table', 'computer', 'trash', 'board', 'clock', 'gavel', 'background'];
    keys.forEach((key, i) => {
      const color = cosmeticData.selected[i];
      if (color && color !== 'default') {
        document.documentElement.style.setProperty(`--${key}-color`, color);
      } else {
        document.documentElement.style.removeProperty(`--${key}-color`);
      }
    });
  }, [cosmeticData]);
//tests part 2

//Test CICD
  // Navigation handlers
  const handleGoToChores = () => navigate(`/chores/${selectedRoomId}`);
  const handleBulletinClick = () => setShowBulletin(true);

  // Cosmetic store API handlers
  const handlePurchaseDecoration = async (decoration) => {
    const { _id: userId } = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/api/room/purchaseDecoration',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roomId: selectedRoomId, decoration }),
        }
      );
      if (!response.ok) throw new Error('Purchase decoration failed');
      const { cosmetic, totalPoints } = await response.json();
      setCosmeticData(cosmetic);
      setPoints(totalPoints);
    } catch (err) {
      console.error(err);
      alert('Not enough points or purchase failed');
    }
  };

  const handleToggleDecoration = async (decoration, enabled) => {
    const { _id: userId } = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/api/room/toggleDecoration',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roomId: selectedRoomId, decoration, enabled }),
        }
      );
      if (!response.ok) throw new Error('Toggle decoration failed');
      const { cosmetic } = await response.json();
      setCosmeticData(cosmetic);
    } catch (err) {
      console.error(err);
      alert('Toggling decoration failed');
    }
  };

  const handlePurchase = async (color) => {
    const { _id: userId } = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/api/room/purchaseColor',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roomId: selectedRoomId, color }),
        }
      );
      if (!response.ok) throw new Error('Purchase failed');
      const { cosmetic, totalPoints } = await response.json();
      setCosmeticData(cosmetic);
      setPoints(totalPoints);
    } catch (err) {
      console.error(err);
      alert('Not enough points or purchase failed');
    }
  };

  const handleSelect = async (index, color) => {
    const { _id: userId } = JSON.parse(localStorage.getItem('userData'));
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + '/api/room/selectColor',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roomId: selectedRoomId, index, color }),
        }
      );
      if (!response.ok) throw new Error('Select color failed');
      const { cosmetic } = await response.json();
      setCosmeticData(cosmetic);
    } catch (err) {
      console.error(err);
    }
  };

  // Room selector handlers
  const handleRoomChange = (e) => setSelectedRoomId(e.target.value);
  const handleConfirm = () => {
    setShowRoomSelector(false);
    if (selectedRoomId === 'master-room') {
      setShowTemporaryPopup(true);
    } else {
      setCosmeticPopupOpen(true);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className={style.appContainer}>
        <div
          className={style.roomBanner}
          style={bannerColor ? { background: bannerColor } : undefined}
        >
          <ExitRoom onClick={() => navigate('/dashboard')} />
          <h1 className={style.roomTitle}>Master Room</h1>
          <div className={style.roomBannerMini}><Avatar /></div>
        </div>

        <div className={style.roomBackground}>
          {roomBgColor && (
            <div
              className={style.bgOverlay}
              style={{ backgroundColor: roomBgColor, opacity: 0.5 }}
            />
          )}

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
                  <div
                    className={style.roomDial}
                    onClick={() => setShowRoomSelector(true)}
                  />
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
                  computer={
                    <Computer
                      handleSettingsClick={() => {}}
                      handleInviteClick={() => {}}
                      roomId="master-room"
                      roomData={userData}
                    />
                  }
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
      <CosmeticStorePopup
        isOpen={cosmeticPopupOpen}
        onClose={() => setCosmeticPopupOpen(false)}
        cosmetics={cosmeticData}
        totalPoints={points}
        onPurchase={handlePurchase}
        onSelect={handleSelect}
        onPurchaseDecoration={handlePurchaseDecoration}
        onToggleDecoration={handleToggleDecoration}
      />

      {/* Room selector popup */}
      {showRoomSelector && (
        <div className={style.roomSelectOverlay} onClick={() => setShowRoomSelector(false)}>
          <div className={style.roomSelectPopup} onClick={(e) => e.stopPropagation()}>
            <h2 className={style.popupTitle}>Choose a room for cosmetics</h2>
            <select
              className={style.popupSelect}
              value={selectedRoomId}
              onChange={handleRoomChange}
            >
              <option value="master-room">Master Room</option>
              {userData.rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.roomName}
                </option>
              ))}
            </select>
            <button className={style.popupOpen} onClick={handleConfirm}>Confirm</button>
            <button className={style.popupClose} onClick={() => setShowRoomSelector(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Temporary manual color picker (if still needed) */}
      {showTemporaryPopup && (
        <div className={style.roomSelectOverlay} onClick={() => setShowTemporaryPopup(false)}>
          <div className={style.roomSelectPopup} onClick={(e) => e.stopPropagation()}>
            <h3>Customize Room Colors</h3>
            <div style={{ margin: '1rem 0' }}>
              <label style={{ marginRight: '0.5rem' }}>Banner Color:</label>
              <input
                type="color"
                value={bannerColor}
                onChange={(e) => setBannerColor(e.target.value)}
            />
            </div>
            <div style={{ margin: '1rem 0' }}>
              <label style={{ marginRight: '0.5rem' }}>Room Overlay Color:</label>
              <input
                type="color"
                value={roomBgColor}
                onChange={(e) => setRoomBgColor(e.target.value)}
            />
            </div>
            <button className={style.popupClose} onClick={() => setShowTemporaryPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default MasterRoom;
