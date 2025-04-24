const mongoose = require("mongoose");

const MemorySchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    image: {
      data: Buffer,
      contentType: String,
    },
    caption: { 
      type: String, 
      default: "" 
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", MemorySchema);
