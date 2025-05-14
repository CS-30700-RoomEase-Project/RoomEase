// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import styles from "./GroupChat.module.css";

// const socket = io("http://localhost:5001");

// const slurs = ["fuck", "shit", "damn", "cunt", "retard"]; 

// const Messages = ({ roomId }) => {
//     const [messages, setMessages] = useState([]);
//     const messagesEndRef = useRef(null); // Reference to scroll to bottom

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groupchat/${roomId}/messages`);
//                 setMessages(response.data.messages);
//             } catch (error) {
//                 console.error("Error fetching messages:", error);
//             }
//         };

//         fetchMessages();

//         socket.emit("joinRoom", roomId);
//         socket.on("newMessage", (newMessage) => {
//             setMessages((prevMessages) => [...prevMessages, newMessage]);
//         });

//         return () => {
//             socket.off("newMessage");
//         };
//     }, [roomId]);

//     useEffect(() => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]); // Scroll to bottom when messages update

//     // Function to replace slurs with ****
//     const sanitizeMessage = (message) => {
//         if (slurs.length === 0) return message; // If slurs aren't loaded yet, return original message

//         let sanitizedMessage = message;
//         slurs.forEach((slur) => {
//             const regex = new RegExp(`\\b${slur}\\b`, 'gi'); // Create a case-insensitive regex to match whole words
//             sanitizedMessage = sanitizedMessage.replace(regex, "****");
//         });

//         return sanitizedMessage;
//     };

//     return (
//         <div className={styles["messages-container"]}>
//             {messages.map((msg, index) => (
//                 <div key={index} className={styles.message}>
//                     <div className={styles.sender}>{msg.senderId}</div>
//                     <div className={styles.content}>{sanitizeMessage(msg.message)}</div>
//                 </div>
//             ))}
//             <div ref={messagesEndRef} /> {/* Invisible div for auto-scroll */}
//         </div>
//     );
// };

// export default Messages;

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import styles from "./GroupChat.module.css";

const socket = io("http://localhost:5001");

const slurs = ["fuck", "shit", "damn", "cunt", "retard", "curry muncher", "ass"]; 

const Messages = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null); // Reference to scroll to bottom

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groupchat/${roomId}/messages`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        socket.emit("joinRoom", roomId);
        
        const handleNewMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };
        
        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Scroll to bottom when messages update

    // Function to replace slurs with ****
    const sanitizeMessage = (message) => {
        if (!message || slurs.length === 0) return message;

        let sanitizedMessage = message;
        let userData = JSON.parse(localStorage.getItem("userData")) || {};
        if (userData.chatFilter) {
            slurs.forEach((slur) => {
                const regex = new RegExp(`\\b${slur}\\b`, 'gi'); // Create a case-insensitive regex to match whole words
                sanitizedMessage = sanitizedMessage.replace(regex, "****");
            });
        }
        return sanitizedMessage;
    };

    // Get initials for avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Format timestamp if available
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={styles["messages-container"]}>
            {loading ? (
                // Loading skeleton
                Array(3).fill(0).map((_, index) => (
                    <div key={index} className={styles["message-skeleton"]}>
                        <div className={styles["avatar-skeleton"]}></div>
                        <div className={styles["content-skeleton"]}>
                            <div className={styles["name-skeleton"]}></div>
                            <div className={styles["text-skeleton"]}></div>
                        </div>
                    </div>
                ))
            ) : (
                <>
                    {messages.length === 0 ? (
                        <div className={styles["empty-messages"]}>
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={styles.message}>
                                <div className={styles.avatar}>
                                    <div className={styles["avatar-inner"]}>
                                        {getInitials(msg.senderId)}
                                    </div>
                                </div>
                                <div className={styles["message-content"]}>
                                    <div className={styles["message-header"]}>
                                        <span className={styles.sender}>{msg.senderId}</span>
                                        {msg.timestamp && (
                                            <span className={styles.timestamp}>
                                                {formatTime(msg.timestamp)}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.content}>
                                        {sanitizeMessage(msg.message)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} /> {/* Invisible div for auto-scroll */}
                </>
            )}
        </div>
    );
};

export default Messages;
