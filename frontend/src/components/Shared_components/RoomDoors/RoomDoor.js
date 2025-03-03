import React from 'react';
import './Door.css';
// import roomIcon from './room-icon.png'; 
import roomIcon from './Door.png';
/**
 * TODO: when clicked, redirect to the room with the specified name\
 * 
 * @param roomName: The name of the room
 * @returns RoomDoor component
 */
const RoomDoor = ({roomName}) => {
    return (
        <div className="room-door">
            <img src={roomIcon} alt="Room Door" className='img' />
            <h2 className="room-name">{roomName}</h2>
        </div>
    );
}
export default RoomDoor;