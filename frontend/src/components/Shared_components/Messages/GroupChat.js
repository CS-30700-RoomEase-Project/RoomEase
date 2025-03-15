// import React, { useState } from 'react';
// import styles from './GroupChat.module.css'; // Importing CSS Module
// import Messages from './Messages';
// import SendMessage from './SendMessage';

// const GroupChat = ({ roomId, userName }) => {
//     const [isPopupVisible, setIsPopupVisible] = useState(false);

//     const togglePopup = () => {
//         setIsPopupVisible(!isPopupVisible);
//     };

//     return (
//         <div>
//             {/* Button to open the popup */}
//             <button className={styles.openPopupButton} onClick={togglePopup}>
//                 Open Group Chat
//             </button>

//             {/* Popup */}
//             {isPopupVisible && (
//                 <div className={styles['popup-container']}>
//                     <div className={styles['popup-content']}>
//                         <button className={styles.closeButton} onClick={togglePopup}>
//                             Close
//                         </button>
//                         <h2 className={styles.heading}>Group Chat Room</h2>
//                         <Messages roomId={roomId} />
//                         <SendMessage roomId={roomId} username={userName} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default GroupChat;

import React, { useState } from 'react';
import styles from './GroupChat.module.css';
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Chat</span>
            </button>

            {/* Popup */}
            {isPopupVisible && (
                <div className={styles['popup-container']}>
                    <div className={styles['popup-content']}>
                        <div className={styles['popup-header']}>
                            <h2 className={styles.heading}>Group Chat</h2>
                            <button className={styles.closeButton} onClick={togglePopup}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <Messages roomId={roomId} />
                        <SendMessage roomId={roomId} username={userName} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChat;
