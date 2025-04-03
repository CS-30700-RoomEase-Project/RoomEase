// backend/models/Clause.js
const mongoose = require('mongoose');

const ClauseSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Clause', ClauseSchema);
