import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useNavigate } from 'react-router-dom';
import "reactjs-popup/dist/index.css";
import style from "./BulletinPopup.module.css";
import '../../Pages/Room/Room Items/RoomItems.css';
import QHLogo from './QuietHoursIcon.png';
import RoomClausesImage from './RoomClauses.png';  
import notesImage from './notes.png';

export default function BulletinPopup({ isOpen, onClose, settings, roomId, onOpenNotes }) {
    const [clauses, setClauses] = useState([]); // State to store clauses
    const navigate = useNavigate();

    // Fetch clauses when the popup is opened
    useEffect(() => {
        const fetchClauses = async () => {
            try {
                const response = await fetch(`/api/rooms/getClauses/${roomId}`); // Adjust API endpoint if necessary
                const data = await response.json();
                setClauses(data); // Store the fetched clauses
            } catch (error) {
                console.error("Error fetching clauses:", error);
            }
        };

        if (isOpen) {
            fetchClauses();
        }
    }, [isOpen, roomId]); // Fetch clauses whenever popup opens or roomId changes

    const handleGoToHours = () => {
        navigate(`/quiet-hours/${roomId}`);
    };

    const handleGoToClauses = () => {
        navigate(`/clauses/${roomId}`);
    };

    return (
        <Popup
            open={isOpen}
            modal
            nested
            onClose={onClose}
            className={style.bulletinContainer}
            overlayClassName={style.bulletinPopupOverlay}
            contentClassName={style.bulletinPopupContent}
        >
            <div className={style.modal}>
                <div className={style.board}>
                    <div className={style.frame}>
                        <div className={style.content}>
                            {settings[0] && <img onClick={handleGoToHours} className={style.quietHours} src={QHLogo} title="Quiet Hours" />}
                            {settings[1] && <img onClick={handleGoToClauses} className={style.roomClauses} src={RoomClausesImage} title="Room Clauses" />} 
                            {settings[2] && <img onClick={onOpenNotes} className={style.notesImage} src={notesImage} title="Room Notes" />}
                            
                            {/* Roommate Clauses - Simple White Rectangle */}
                            <div className={style.clausesBox} onClick={handleGoToClauses}>
                                {clauses.length > 0 ? (
                                    <ul>
                                        {clauses.map((clause, index) => (
                                            <li key={index}>{clause.text}</li> // Assuming clause.text is the text of the clause
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No clauses available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
}
