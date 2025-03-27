import React from 'react';
import './RoomItems.css';

function Gavel({ onClick }) {
    return (
        <div className="gavel-container" onClick={onClick}>
            <div className="gavel-handle"></div>
            <div className="gavel-head"></div>
        </div>
    );
}

export default Gavel;
