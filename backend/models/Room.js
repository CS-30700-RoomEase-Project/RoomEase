const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    groupPhoto: { type: String, default: '' },
    settings: [{ type: Boolean }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: [] }],
    roomStatus: { type: String, default: 'Available' },
    groupChat: [{
        senderId: { type: String, required: true }, // User ID (as string)
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    roomMembers: [{ type: String, default: [] }],
    monthlyRatings: [{ type: String, default: [] }],
    points: [{ type: Number, default: [] }],
    houseRules: [{ type: String, default: [] }],
    completedTasks: [],
    bulletinNotes: [{ type: Array, default: [] }],
    bulletinPhotos: [{ type: Array, default: [] }],
    outGoingInvites: { type: Array, default: [] },
    quietHours: [{ type: Array, default: [] }]
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
