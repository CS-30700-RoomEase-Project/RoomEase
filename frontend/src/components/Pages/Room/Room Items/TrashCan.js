import React from 'react';

/**
 * TrashCan component to represent a trash can item in the room
 */
const TrashCan = ({ onClick }) => {
    return (
        <div className="trashCan" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="trashCanLid">
                <div className='trashCanLidHandle' />
                <div className='trashCanLidBody' />
            </div>
            <div className="trashCanBody">
                <div className='trashCanBodyAccent' style={{ transform: 'rotate(355deg)' }} />
                <div className='trashCanBodyAccent' />
                <div className='trashCanBodyAccent' style={{ transform: 'rotate(5deg)' }} />
            </div>
        </div>
    );
};

export default TrashCan;
