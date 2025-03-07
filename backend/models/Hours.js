const mongoose = require("mongoose");

const RoomStateSchema = new mongoose.Schema({
    request: { type: String, required: true },
    level: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RoomState", RoomStateSchema); // Ensure this is consistent