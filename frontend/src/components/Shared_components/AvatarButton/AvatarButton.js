import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './AvatarButton.css';
import { useNavigate } from "react-router-dom";

/**
 * TODO: - Add functionality to redirect to settings page when settings button is clicked
 *       - Add more options if needed
 * 
 * @param imageUrl: The url of the image to display 
 * @returns Circular image of the user's avatar that opens a dropdown when clicked
 */
const AvatarButton = ({ imageUrl }) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePic');
    navigate('/');
  };

  const launchSettings = () => {
  };

  return (
    <Popup trigger={
      <div className='container'>
        <img
          src={imageUrl}
          alt="Profile"
          className='circularImage'
          onClick={toggleDropdown}
        />
      </div>
    } arrow={false} position="bottom" on="click" open={isOpen} closeOnDocumentClick>
      <div className='dropdown'>
        <button onClick={launchSettings} className='dropdownItem'>Settings</button>
        <button onClick={handleLogout} className='signoutButton'>Logout</button>
      </div>
    </Popup>
  );
};

export default AvatarButton;