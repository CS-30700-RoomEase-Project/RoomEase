import React from 'react';
import './RoomItems.css';

function Gavel({ onClick, enabled }) {
    return (
        <div className="gavel-container" onClick={onClick} title={(enabled) ? "Handle Disputes" : ""} style={{ cursor: 'pointer', pointerEvents: (enabled) ? "auto" : "none" }}>
            <div className="gavel-handle"></div>
            <div className="gavel-head"></div>
        </div>
    );
}

export default Gavel;
