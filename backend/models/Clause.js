const mongoose = require('mongoose');

const ClauseSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    text: {
      type: String,
      required: true,
      default: ''
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true  // createdAt & updatedAt
  }
);

module.exports = mongoose.model('Clause', ClauseSchema);
