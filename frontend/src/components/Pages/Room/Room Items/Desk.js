import React, { Children } from 'react';
import './RoomItems.css';
import GavelPad from './GavelPad';
import Gavel from './Gavel';

function Desk({ children }) {
    return (
        <div className='deskContainer'>
            <div className='deskItems'>
                {children}
                <GavelPad />
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