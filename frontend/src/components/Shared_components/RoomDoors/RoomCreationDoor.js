import React, { useState } from 'react';
import './Door.css';
import RoomDoor from './RoomDoor';
import { useNavigate } from "react-router-dom";
import roomIcon from './room-creator-icon.png'; 
import CreateRoomPopup from '../CreateRoom/CreateRoomPopup';

/**
 * TODO: Implement functionality to create a room
 * 
 * @returns RoomCreationDoor component
 */
const RoomCreationDoor = () => {
    const navigate = useNavigate();
    const [showRoomCreation, setShowSettings] = useState(false);

    const handleRoomCreationClick = () => {
        setShowSettings(true);
    };

    return (
        <>
            <div className="room-door"
                onClick={handleRoomCreationClick}>
                <img src={roomIcon} alt="Room Door" className='img' />
                <h2 className="room-name">Create Room</h2>
            </div>

            <CreateRoomPopup isOpen={showRoomCreation} onClose={() => setShowSettings(false)} />
        </>
    );
};

export default RoomCreationDoor;