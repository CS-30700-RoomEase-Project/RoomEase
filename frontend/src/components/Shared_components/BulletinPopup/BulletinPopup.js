import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useNavigate } from 'react-router-dom';
import "reactjs-popup/dist/index.css";
import style from "./BulletinPopup.module.css";
import '../../Pages/Room/Room Items/RoomItems.css';
import QHLogo from './QuietHoursIcon.png';
import RoomClausesImage from './RoomClauses.png';  // Import RoomClauses image
import notesImage from './notes.png';

export default function BulletinPopup({ isOpen, onClose, settings, roomId, onOpenNotes }) {
    const navigate = useNavigate();
    const [showNotesPopup, setShowNotesPopup] = useState(false);

    const handleGoToHours = () => {
        console.log("Navigating to quiet-hours with roomId:", roomId); // Debugging
        navigate(`/quiet-hours/${roomId}`);
    }

    const handleNotesPopup = (roomId) => {
        setShowNotesPopup(true);
        console.log("NotesPopup with roomId:", roomId)
    }

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
                            {settings[3] && <img onClick={() => handleGoToHours()} className={style.quietHours} src={QHLogo} title="Quiet Hours"/>}
                            {settings[4] && <img className={style.roomClauses} src={RoomClausesImage} title="Room Clauses" />} {/* Add RoomClauses image */}
                            {<img onClick={onOpenNotes} className={style.notesImage} src={notesImage} title="Room Notes"/>}
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
}
