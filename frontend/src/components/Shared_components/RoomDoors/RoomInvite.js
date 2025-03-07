import React, { useState } from 'react';
import './Door.css';
import '../CreateRoom/CreateRoom.css'
import roomIcon from './Door.png';
import { useNavigate } from "react-router-dom";
import xIcon from './x-icon.png';
import checkIcon from './check-icon.png';
import Popup from "reactjs-popup";

/**
 * 
 * @param roomName: The name of the room
 * @returns RoomDoor component
 */
const RoomInvite = ({roomName, accept, decline}) => {
    const navigate = useNavigate();
    const [showRoomInvite, setShowInvite] = useState(false);

    const handleRoomInviteClick = () => {
        setShowInvite(true);
    };

    return (
        <>
            <div className="room-door"
                onClick={handleRoomInviteClick}>
                <img src={roomIcon} alt="Room Door" className='img' />
                <h2 className="room-name">Invite to Join {roomName}</h2>
            </div>

            <Popup
                open={showRoomInvite}
                modal
                nested
                onClose={() => setShowInvite(false)}
                className="create-room-container"
                overlayClassName="invite-popup-overlay"
                contentClassName="invite-popup-content"
            >
                <div className="invite-modal">
                    <h1 className='invite-header'>Accept/Decline invite from {roomName}</h1>
                    <div className="popup-buttons">
                        <div className='accept-button' onClick={() => { setShowInvite(false); accept(); }}>
                            <img src={checkIcon}/>
                        </div>
                        <div className='decline-button' onClick={() => {setShowInvite(false); decline();}}>
                            <img src={xIcon}/>
                        </div>
                    </div>
                </div>
            </Popup>
        </>
    );
}
export default RoomInvite;