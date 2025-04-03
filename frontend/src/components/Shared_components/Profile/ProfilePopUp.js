import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./ProfilePopUp.css";
import ProfileSettings from "./ProfileSettings";

    

export default function ProfilePopUp({ isOpen, onClose }) { 

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
                <ProfileSettings onClose={onClose}/>
            </div>
        </Popup>
    );
}