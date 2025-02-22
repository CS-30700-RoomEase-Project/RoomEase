import React from 'react';
import './Door.css';
import RoomDoor from './RoomDoor';
import roomIcon from './room-creator-icon.png'; 

/**
 * TODO: Implement functionality to create a room
 * 
 * @returns RoomCreationDoor component
 */
const RoomCreationDoor = () => {
    return (
        <div className="room-door">
            <img src={roomIcon} alt="Room Door" className='img' />
            <h2 className="room-name">Create Room</h2>
       </div>
    );
};

export default RoomCreationDoor;