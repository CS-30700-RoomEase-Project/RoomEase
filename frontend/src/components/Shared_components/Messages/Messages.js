import axios from "axios";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./GroupChat.module.css";

const socket = io("http://localhost:5001");

const Messages = ({ roomId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/groupchat/${roomId}/messages`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Join the chat room
    socket.emit("joinRoom", roomId);

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [roomId]);

  return (
    <div className={styles.messagesContainer}>
      {messages.map((msg, index) => (
        <div key={index} className={styles.message}>
          <div className={styles.sender}>{msg.senderId}</div>
          <div className={styles.content}>{msg.message}</div>
        </div>
      ))}
    </div>
  );
};

export default Messages;
