const mongoose = require("mongoose");

const QuietHoursSchema = new mongoose.Schema({
    request: { type: String, required: true },  // Example: "Quiet Hours Updated"
    level: { type: String, required: true },    // Example: "High" (or custom)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hours", QuietHoursSchema);
