import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useNavigate } from 'react-router-dom';
import "reactjs-popup/dist/index.css";
import style from "./BulletinPopup.module.css";
import '../../Pages/Room/Room Items/RoomItems.css';
import QHLogo from './QuietHoursIcon.png';
import NotesImage from './notes.png'; // Import the notes.png image
import CallService from "../../SharedMethods/CallService";

const defaultRules = ["No active rules found"];
const defaultNotes = "No current notes";

export default function BulletinPopup({ isOpen, onClose, settings, roomId, onOpenNotes }) {
    const [rules, setRules] = useState([]);
    const [notes, setNotes] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && roomId) {
            CallService(`rules/getList/${roomId}`, {}, (data) => {
                if (data) {
                    const updatedRules = data.length ? data : [...defaultRules];
                    setRules(updatedRules);
                } else {
                    console.error("No data received from rules API");
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

    const handleGoToRules = () => {
        navigate(`/house-rules/${roomId}`);
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

                            {/* Roommate Ruless Box */}
                            {settings[1] && (
                                <div className={style.rulesBox} onClick={handleGoToRules}>
                                    <div 
                                        className={style.rulesList} 
                                        title="View your House Rules"
                                    >
                                        {rules.length > 0 ? (
                                            rules.slice(0, 5).map((rule, index) => (
                                                <p key={index} className={style.ruleItem}>
                                                    • {typeof rule === "string" ? rule : rule.text}
                                                </p>
                                            ))
                                        ) : (
                                            <p className={style.ruleItem}>No rules available</p>
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
