import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import ProfilePopUp from '../Profile/ProfilePopUp';
import './AvatarButton.css';

const AvatarButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  /* Get the User data to find the avatar image */
  let userData = JSON.parse(localStorage.getItem('userData'));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    const userData = {
      userId: "",
      username: "",
      profilePic: "",
      reviews: [],
      totalPoints: 0
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.removeItem('userId');
    // localStorage.removeItem('username');
    // localStorage.removeItem('profilePic');
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

      <ProfilePopUp isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};

export default AvatarButton;
