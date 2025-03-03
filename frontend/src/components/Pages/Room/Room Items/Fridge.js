import React from 'react';
import './RoomItems.css';

/**
 * 
 * @returns Fridge component that will go into the room class and display the fridge
 */
function Fridge() {
    return (
        <div className='fridgeContainer'>
            <div className='freezerDoor'>
                <div className='fridgeHandle'/>
            </div>
            <div className='fridgeDoor'>
                <div className='fridgeHandle'/>
            </div>
        </div>
    )
}

export default Fridge;