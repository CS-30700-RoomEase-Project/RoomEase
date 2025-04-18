const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    groupPhoto: { type: String, default: '' },
    settings: [{ type: Boolean }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: [] }],
    roomStatus: { type: String, default: 'Available' },
    roomState: { type: String, default: 'FFFFFF'},
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
    choreSwaps: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'choreSwap'}], default: []},
    clauses: [{ type: String, default: ["These are your roommate clauses", "Add, edit, or change clauses", "Change them as you like"] }],
    roomImage: { type: Buffer, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
