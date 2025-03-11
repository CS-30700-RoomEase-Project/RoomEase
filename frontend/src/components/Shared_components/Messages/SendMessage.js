// src/components/SendMessage.js
import axios from 'axios';
import React, { useState } from 'react';

const SendMessage = ({ roomId, username }) => {
    const [message, setMessage] = useState('');
    // console.log(username);
    const [senderId] = useState(username); // Replace with actual user ID (possibly from context or props)
    // setSender(username);
    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                const response = await axios.post(
                    `http://localhost:5001/api/groupchat/${roomId}/message`,
                    {
                        senderId,
                        message
                    }
                );
                setMessage('');
                console.log('Message sent:', response.data);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default SendMessage;
