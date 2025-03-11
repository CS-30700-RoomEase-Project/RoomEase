const mongoose = require('mongoose');
const MessageSchema = require('./Message');

const GroupChatSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true, unique: true }, // Each GroupChat belongs to one room
    messages: [MessageSchema] // Embedded array of messages
}, { timestamps: true });

module.exports = mongoose.model('GroupChat', GroupChatSchema);
