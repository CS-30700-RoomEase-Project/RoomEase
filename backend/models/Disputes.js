// backend/models/Disputes.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DisputeSchema = new Schema({
  description: { type: String, required: true },
  timestamp:   { type: Date,   default: Date.now }
});

module.exports = DisputeSchema;
