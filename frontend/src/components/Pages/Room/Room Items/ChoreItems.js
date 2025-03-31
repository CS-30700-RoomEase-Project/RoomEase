import React from 'react';
import Broom from './Broom';
import TrashCan from './TrashCan';

const ChoreItems = ({onClick, enabled}) => {
    const handleClick = () => {
        if (enabled) {
            onClick();
        } else {
            return;
        }
    }
    return (
        <div className='choreItems' title='Chores' onClick={handleClick} style={{ cursor: 'pointer', pointerEvents: (enabled) ? "auto" : "none" }}>
            <Broom />
            <TrashCan />
        </div>
    );
}

export default ChoreItems;