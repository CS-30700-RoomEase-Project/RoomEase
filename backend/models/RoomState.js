const mongoose = require("mongoose");

const RoomStateSchema = new mongoose.Schema({
    request: { type: String, required: true },
    level: { type: String, required: true },
    color: { type: String, required: true }, // New color field for each state
    createdAt: { type: Date, default: Date.now }
});

// Add default colors for existing levels if necessary
RoomStateSchema.statics.getDefaultLevels = function() {
    return [
        { level: "Low", color: "#00FF00" },    // Green for Low level
        { level: "Medium", color: "#FFFF00" }, // Yellow for Medium level
        { level: "High", color: "#FF0000" }    // Red for High level
    ];
};

RoomStateSchema.statics.createNewState = function(request, level, color) {
    return this.create({ request, level, color });
};

module.exports = mongoose.model("State", RoomStateSchema);
