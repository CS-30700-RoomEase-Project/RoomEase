import React, { useState } from 'react';
import styles from './GroupChat.module.css'; // Importing CSS Module
import Messages from './Messages';
import SendMessage from './SendMessage';

const GroupChat = ({ roomId, userName }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    return (
        <div>
            {/* Button to open the popup */}
            <button className={styles.openPopupButton} onClick={togglePopup}>
                Open Group Chat
            </button>

            {/* Popup */}
            {isPopupVisible && (
                <div className={styles['popup-container']}>
                    <div className={styles['popup-content']}>
                        <button className={styles.closeButton} onClick={togglePopup}>
                            Close
                        </button>
                        <h2 className={styles.heading}>Group Chat Room</h2>
                        <Messages roomId={roomId} />
                        <SendMessage roomId={roomId} username={userName} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChat;
