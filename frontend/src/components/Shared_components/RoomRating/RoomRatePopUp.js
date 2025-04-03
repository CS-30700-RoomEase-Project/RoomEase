import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import RoomRate from "./RoomRate";
import "./RoomRatePopUp.css";

export default function RoomRatePopUp({ isOpen, onClose }) {
  return (
    <Popup
      open={isOpen}
      modal
      nested
      onClose={onClose}
      className="profile-popup-container"
      overlayClassName="profile-popup-overlay"
      contentClassName="profile-popup-content"
    >
      <div className="modal">
        <RoomRate onClose={onClose} />
      </div>
    </Popup>
  );
}
