// // src/components/SendMessage.js
// import axios from 'axios';
// import React, { useState } from 'react';

// const SendMessage = ({ roomId, username }) => {
//     const [message, setMessage] = useState('');
//     // console.log(username);
//     const [senderId] = useState(username); // Replace with actual user ID (possibly from context or props)
//     // setSender(username);
//     const handleSendMessage = async () => {
//         if (message.trim()) {
//             try {
//                 const response = await axios.post(
//                     `http://localhost:5001/api/groupchat/${roomId}/message`,
//                     {
//                         senderId,
//                         message
//                     }
//                 );
//                 setMessage('');
//                 console.log('Message sent:', response.data);
//             } catch (error) {
//                 console.error('Error sending message:', error);
//             }
//         }
//     };

//     return (
//         <div>
//             <textarea
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type your message..."
//             />
//             <button onClick={handleSendMessage}>Send</button>
//         </div>
//     );
// };

// export default SendMessage;
"use client"

import axios from "axios"
import { useState } from "react"
import styles from "./GroupChat.module.css"

const SendMessage = ({ roomId, username }) => {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const awardQuestPoints = async (userId, roomId, questType) => {
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/api/room/award-quest-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensures the body is JSON
            },
            body: JSON.stringify({
                userId,
                roomId,
                questType
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Points awarded:', result.message);
        } else {
            console.error('Error:', result.message);
        }
    } catch (error) {
        console.error('Error calling API:', error);
    }
  };


  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsSending(true)
    try {
      const storedUser = localStorage.getItem("userData");
      const parsedUser = JSON.parse(storedUser);
      const currentUserId = parsedUser._id;
      awardQuestPoints(currentUserId, roomId, "sendChat");
      await axios.post(`http://localhost:5001/api/groupchat/${roomId}/message`, {
        senderId: username,
        message: message.trim(),
      })
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e) => {
    // Send message on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={styles["message-form"]}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className={styles["message-input"]}
        disabled={isSending}
      />
      <div className={styles["message-actions"]}>
        <span className={styles["message-hint"]}>Press Ctrl+Enter to send</span>
        <button onClick={handleSendMessage} disabled={!message.trim() || isSending} className={styles["send-button"]}>
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  )
}

export default SendMessage

