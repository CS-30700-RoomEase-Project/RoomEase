import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useNavigate } from 'react-router-dom';
import "reactjs-popup/dist/index.css";
import style from "./BulletinPopup.module.css";
import '../../Pages/Room/Room Items/RoomItems.css';
import QHLogo from './QuietHoursIcon.png';
import RoomClausesImage from './RoomClauses.png';
import NotesImage from './notes.png'; // Import the notes.png image
import CallService from "../../SharedMethods/CallService";

const defaultClauses = ["No active clauses found"];
const defaultNotes = "No current notes";

export default function BulletinPopup({ isOpen, onClose, settings, roomId, onOpenNotes }) {
    const [clauses, setClauses] = useState([]);
    const [notes, setNotes] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && roomId) {
            CallService(`clauses/getList/${roomId}`, {}, (data) => {
                if (data) {
                    const updatedClauses = data.length ? data : [...defaultClauses];
                    setClauses(updatedClauses);
                } else {
                    console.error("No data received from clauses API");
                }
            });

            CallService(`room/getNotes/${roomId}`, {}, (data) => {
                if (data && typeof data === "string") {
                    setNotes(data.trim() || defaultNotes);
                } else {
                    setNotes(defaultNotes);
                    console.error("Invalid data received from notes API");
                }
            });
        }
    }, [isOpen, roomId]);

    const handleGoToHours = () => {
        navigate(`/quiet-hours/${roomId}`);
    };

    const handleGoToClauses = () => {
        navigate(`/clauses/${roomId}`);
    };

    const handleOpenNotes = () => {
        onOpenNotes && onOpenNotes(); // Use prop if provided
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
                            {/* Quiet Hours Logo */}
                            {settings[0] && (
                                <div className={style.quietHoursWrapper}>
                                    <img
                                        onClick={handleGoToHours}
                                        className={style.quietHours}
                                        src={QHLogo}
                                        title="View your Quiet Hours"
                                    />
                                </div>
                            )}

                            {/* Room Notes Image */}
                            {settings[2] && (
                                <div 
                                    className={style.notesImage} 
                                    title="View your Room Notes" 
                                    onClick={handleOpenNotes}
                                >
                                    <img 
                                        src={NotesImage} 
                                        alt="Room Notes" 
                                        className={style.notesIcon} 
                                    />
                                </div>
                            )}

                            {/* Roommate Clauses Box */}
                            {settings[1] && (
                                <div className={style.clausesBox} onClick={handleGoToClauses}>
                                    <div 
                                        className={style.clausesList} 
                                        title="View your Roommate Clauses"
                                    >
                                        {clauses.length > 0 ? (
                                            clauses.slice(0, 5).map((clause, index) => (
                                                <p key={index} className={style.clauseItem}>
                                                    • {typeof clause === "string" ? clause : clause.text}
                                                </p>
                                            ))
                                        ) : (
                                            <p className={style.clauseItem}>No clauses available</p>
                                        )}
                                    </div>
                                    <p className={style.viewMore}>Click to view more</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
}
