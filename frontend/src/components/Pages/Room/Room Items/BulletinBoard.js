import React from "react";
import './RoomItems.css';

function BulltinBoard({ onClick, settings }) {
    return (
        <div 
            className="bulletinBoard" 
            title={ ("Bulletin Board") } 
            onClick={onClick} 
            style={{ cursor: 'pointer', pointerEvents: "auto" }}
        >
            <div className="bulletinBoardFrame">
                <div className="bulletinBoardContent"/>
            </div>
        </div>
    );
}

export default BulltinBoard;