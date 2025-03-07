import React from "react";
import './RoomItems.css';

function BulltinBoard({onClick}) {
    return (
<<<<<<< HEAD
        <div className="bulletinBoard" title="Bulletin Board">
=======
        <div className="bulletinBoard" onClick={onClick} style={{ cursor: 'pointer' }}>
>>>>>>> main
            <div className="bulletinBoardFrame">
                <div className="bulletinBoardContent"/>
            </div>
        </div>
    );
}

export default BulltinBoard;