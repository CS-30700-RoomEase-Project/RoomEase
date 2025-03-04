import React from 'react';
import './RoomItems.css';
import { useState } from 'react';
import GroceryPopUp from '../../GroceryPage/GroceryPopUp';

/**
 * 
 * @returns Fridge component that will go into the room class and display the fridge
 */
function Fridge() {
    
    const [isPopUpOpen, setPopUpOpen] = useState(false);
    
    return (
        <div className='fridgeContainer' onClick={() => setPopUpOpen(true)}>
            <div className='freezerDoor'>
                <div className='fridgeHandle'/>
            </div>
            <div className='fridgeDoor'>
                <div className='fridgeHandle'/>
            </div>
            <GroceryPopUp isOpen={isPopUpOpen} onClose={() => setPopUpOpen(false)} />
        </div>
    )
}

export default Fridge;