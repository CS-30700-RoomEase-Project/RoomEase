import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./CreateRoom.css";
import CreateRoom from "./CreateRoom";

    

export default function CreateRoomPopup({ isOpen, onClose }) { 

    return (
        <Popup
            open={isOpen}
            modal
            nested
            onClose={onClose}
            className="create-room-container"
            overlayClassName="create-room-popup-overlay"
            contentClassName="create-room-popup-content"
        >
            <div className="modal">
                <CreateRoom onClose={onClose}/>
            </div>
        </Popup>
    );
}
