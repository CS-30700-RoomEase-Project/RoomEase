const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  userId: { type: String, unique: true },
  profilePic: { type: String, default: 'https://www.gravatar.com/avatar/'},
  contactInfo: Number,
  totalPoints: { type: Number, default: 0 },
  //notifications
  reviews: { type: Array, default: [] },
  //room Cosmetics
  //notification settings
  chatFilter: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);