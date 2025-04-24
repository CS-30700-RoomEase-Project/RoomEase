const mongoose = require('mongoose');
const { Schema } = mongoose;

const userValueSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, default: 0 },
});

const WrappedSchema = new Schema({
  date: { type: Date, required: true },
  Chores: [userValueSchema],
  Groceries: [userValueSchema],
  Bills: [userValueSchema],
});

module.exports = mongoose.model('Wrapped', WrappedSchema);
