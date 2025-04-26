import React, { useState } from "react";
import RoomRatePopUp from "./RoomRatePopUp"; // Import the popup component

const RateButton = () => {
  const [isOpen, setIsOpen] = useState(false); // Manage popup open/close state

  const openPopup = () => {
    setIsOpen(true); // Open the popup
  };

  const closePopup = () => {
    setIsOpen(false); // Close the popup
  };

  return (
    <div>
        <button 
          onClick={openPopup} 
          className="rate-button" 
          title="Rate your roommate"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9 12 2" />
        </svg>

        </button>

        {/* RoomRatePopUp will appear when isOpen is true */}
      <RoomRatePopUp isOpen={isOpen} onClose={closePopup} />
    </div>
  );
};

export default RateButton;
