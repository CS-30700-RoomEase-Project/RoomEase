import React from 'react';
import './RoomItems.css';
import { useState } from 'react';
import GroceryPopUp from '../../GroceryPage/GroceryPopUp';

/**
 * 
 * @returns Fridge component that will go into the room class and display the fridge
 */
function Fridge({ room, enabled }) {
    
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    
    const handleClick = () => {
        if (enabled) {
            setPopUpOpen(true);
        } else {
            return;
        }
    }

    return (

        <div className='fridgeContainer' onClick={handleClick} 
            style={{ cursor: 'pointer', pointerEvents: (enabled) ? "auto" : "none"} } title={(enabled) ? "Grocery List" : ""}>
            <div className='freezerDoor'>
                <div className='fridgeHandle'/>
            </div>
            <div className='fridgeDoor'>
                <div className='fridgeHandle'/>
            </div>
            <GroceryPopUp room={room} isOpen={isPopUpOpen} onClose={() => setPopUpOpen(false)} />
        </div>
    )
}

export default Fridge;