const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: { type: String, required: true }, // References User who sent the message
    message: { type: String, required: true }, // Message content
    timestamp: { type: Date, default: Date.now }, // Timestamp for message sent time
    edited: { type: Boolean, default: false }, // Indicates if the message was edited
}, { timestamps: true });

module.exports = MessageSchema; // Export schema (not model) to be embedded in GroupChat
