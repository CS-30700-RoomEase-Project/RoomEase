import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import ProfilePopUp from '../Profile/ProfilePopUp';
// import RoomRatePopUp from '../RoomRating/RoomRatePopUp';
import './AvatarButton.css';
const AvatarButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  /* Get the User data to find the avatar image */
  const [userData, setUserData] = useState(() => {
    const savedData = localStorage.getItem('userData');
    return savedData 
      ? JSON.parse(savedData) 
      : { profilePic: '/default-avatar.png', username: 'Guest' };
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userData') {
        setUserData(
          e.newValue 
            ? JSON.parse(e.newValue) 
            : { profilePic: '/default-avatar.png', username: 'Guest' }
        );
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    // const userData = {
    //   userId: "",
    //   username: "",
    //   profilePic: "",
    //   reviews: [],
    //   totalPoints: 0
    // };
    // localStorage.setItem('userData', JSON.stringify(userData));
    // localStorage.removeItem('userId');
    // localStorage.removeItem('roomData');
    localStorage.removeItem('userId');
    localStorage.clear();
    navigate('/');
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setIsOpen(false); // Close dropdown when opening settings
  };

  return (
    <>
      <Popup 
        trigger={
          <div className='container'>
            <img
              src={userData.profilePic}
              alt="Profile"
              className='circularImage'
              onClick={toggleDropdown}
            />
          </div>
        } 
        arrow={false} 
        position="bottom" 
        on="click" 
        open={isOpen} 
        closeOnDocumentClick
      >
        <div className='dropdown'>
          <button onClick={handleSettingsClick} className='dropdownItem'>Settings</button>
          <button onClick={handleLogout} className='signoutButton'>Logout</button>
        </div>
      </Popup>
      {/* <RoomRatePopUp isOpen={showSettings} onClose={() => setShowSettings(false)} /> */}
      <ProfilePopUp isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default AvatarButton;
