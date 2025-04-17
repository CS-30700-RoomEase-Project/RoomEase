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
          Ratings
        </button>

        {/* RoomRatePopUp will appear when isOpen is true */}
      <RoomRatePopUp isOpen={isOpen} onClose={closePopup} />
    </div>
  );
};

export default RateButton;
