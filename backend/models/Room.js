const mongoose = require('mongoose');

const DisputeSchema = require('./Disputes');

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true },
    groupPhoto: { type: String, default: '' },
    settings: [{ type: Boolean }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: [] }],
    // chronological list of every room‐state the user has set
    roomStates: [{
        request: { type: String, required: true },
        level:   { type: String, required: true },
        color:   { type: String, required: true },
        timestamp:{ type: Date, default: Date.now }
    }],
    // pointer into that array
    currentStateIndex: {
        type: Number,
        default: (doc) => doc.roomStates.length - 1
    },
    groupChat: [{
        senderId: { type: String, required: true }, // User ID (as string)
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
    roomMembers: [{ type: String, default: [] }],
    monthlyRatings: [{ type: String, default: [] }],
    points: { type: Map, of: Number, default: () => ({})},
    houseRules: [{ type: String, default: [] }],
    completedTasks: {type:[{type:mongoose.Schema.Types.ObjectId, ref: 'Wrapped'}], default: []},
    bulletinNotes: { type: [String], default: [] },
    bulletinPhotos: [{ type: Array, default: [] }],
    outGoingInvites: { type: Array, default: [] },
    quietHours: [{ type: Array, default: [] }],
    chorePoints: { type: Map, of: Number, default: () => ({Easy: 3,Medium: 5,Hard: 7})},
    choreSwaps: {type: [{type: mongoose.Schema.Types.ObjectId, ref: 'choreSwap'}], default: []},
    rules: [{ type: String, default: ["These are your roommate rules", "Add, edit, or change rules", "Change them as you like"] }],
    roomImage: { type: Buffer, default: null },
    roomClauses: { type: String, default: ""},
    disputes: {
        type: [DisputeSchema],
        default: []
    },
    // pointer into `disputes[]`; -1 means “no current dispute”
    currentDisputeIndex: {
        type: Number,
        default: -1
    },

}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);
