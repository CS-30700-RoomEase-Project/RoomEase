import React from "react";
import './RoomItems.css';

function BulltinBoard({ onClick, enabled }) {
    return (
        <div 
            className="bulletinBoard" 
            title={ ("Bulletin Board") } 
            onClick={onClick} 
            style={{ cursor: 'pointer', pointerEvents: ((enabled) ? "auto" : "none") }}
        >
            <div className="bulletinBoardFrame">
                <div className="bulletinBoardContent"/>
            </div>
        </div>
    );
}

export default BulltinBoard;