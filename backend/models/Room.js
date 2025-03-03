const mongoose = require('mongoose');
const Task = require('./Tasks');
const User = require('./User');

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true }, // roomName [String]
    groupPhoto: { type: String, default: ''}, // image
    settings: [{ type: Boolean }], // boolean array
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: [] }], // List of Task objects
    roomStatus: { type: String, default: 'Available' }, // roomStatus (clock) [String]
    groupChatID: { type: Number, default: '' }, // groupChatID [Int]
    roomMembers: [{ type: String, default: [] }], // List of User ids
    monthlyRatings: [{ type: String, default: [] }], // array of strings
    points: [{ type: Number, default: [] }], // List of ints
    houseRules: [{ type: String, default: [] }], // strings
    completedTasks: [], // list
    bulletinNotes: [{ type: Array, default: [] }], // list of tuples
    bulletinPhotos: [{ type: Array, default: [] }] // list of tuples
}, { timestamps: true });

// Define the Room model
module.exports = mongoose.model('Room', RoomSchema);
