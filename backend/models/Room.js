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
    points: { type: Map, of: Number, default: () => ({})},
    houseRules: [{ type: String, default: [] }],
    completedTasks: [],
    bulletinNotes: { type: [String], default: [] },
    bulletinPhotos: [{ type: Array, default: [] }],
    outGoingInvites: { type: Array, default: [] },
    quietHours: [{ type: Array, default: [] }],
    chorePoints: { type: Map, of: Number, default: () => ({Easy: 3,Medium: 5,Hard: 7})},
    clauses: [{ type: String, default: ["Leave the toilet seat up", "Play your music as loud as possible", "Keep all doors open"] }]
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
