import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Popup from 'reactjs-popup';
import ProfilePopUp from '../Profile/ProfilePopUp';
import MyReview from '../myReviews/MyReview';
import './AvatarButton.css';

const AvatarButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReviews, setShowReviews] = useState(false);  // New state for MyReview modal
  let location = useLocation();

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
    localStorage.removeItem('userId');
    localStorage.clear();
    navigate('/');
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
    setIsOpen(false); // Close dropdown when opening settings
  };

  const handleReviewsClick = () => {
    setShowReviews(true);
    setIsOpen(false); // Close dropdown when opening reviews
  };

  const handleCloseReviews = () => {
    setShowReviews(false); // Close the modal from AvatarButton
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
          <button onClick={handleSettingsClick} className='Button1'>Settings</button>
          {!location.pathname.includes("dashboard") && !location.pathname.includes("master-room") && <button onClick={handleReviewsClick} className='Button2'>My Reviews</button>}
          <button onClick={handleLogout} className='signoutButton'>Logout</button>
        </div>
      </Popup>
      <MyReview isOpen={showReviews} onClose={handleCloseReviews} /> {/* Pass handler here */}
      <ProfilePopUp isOpen={showSettings} onClose={() => setShowSettings(false)} /> {/* Use showSettings for ProfilePopUp */}
    </>
  );
};

export default AvatarButton;
