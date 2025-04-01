const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  recId: [{ type: String, required: true }],  
  cleanRating: [{ type: Number, required: true }],  
  noiseRating: [{ type: Number, required: true }],  
  paymentRating: [{ type: Number, required: true }],  
  rulesRating: [{ type: Number, required: true }],  
  numRating: [{ type: Number, required: true, default: 1 }],  // Ensure numRating starts at 1
});

module.exports = mongoose.model("Rating", RatingSchema);
