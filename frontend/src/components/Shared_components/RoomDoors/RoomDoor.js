import React from 'react';
import './Door.css';
// import roomIcon from './room-icon.png'; 
import roomIcon from './Door.png';
/** 
 * @param roomName: The name of the room
 * @returns RoomDoor component
 */
const RoomDoor = ({roomName, onClick}) => {
    return (
        <div className="room-door" onClick={onClick}>
            <img src={roomIcon} alt="Room Door" className='img' />
            <h2 className="room-name">{roomName}</h2>
        </div>
    );
}
export default RoomDoor;