import React from "react";
import './RoomItems.css';

function BulltinBoard({onClick}) {
    return (
        <div className="bulletinBoard" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="bulletinBoardFrame">
                <div className="bulletinBoardContent"/>
            </div>
        </div>
    );
}

export default BulltinBoard;