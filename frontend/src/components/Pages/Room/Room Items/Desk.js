import React, { Children } from 'react';
import './RoomItems.css';

function Desk({ children }) {
    return (
        <div className='deskContainer'>
            <div className='deskItems'>
                {children}
            </div>
            <div className='desk'>
                <div className='deskTop'></div>
                <div className='deskLegs'>
                    <div className='deskLeg'/>
                    <div className='deskLeg'/>
                </div>
            </div>
        </div>
    )
}

export default Desk;