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
      {/* Rate button */}
      <button onClick={openPopup} className="rate-button">
        Rate Roommates
      </button>

      {/* RoomRatePopUp will appear when isOpen is true */}
      <RoomRatePopUp isOpen={isOpen} onClose={closePopup} />
    </div>
  );
};

export default RateButton;
