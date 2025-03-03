const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: false },
  userId: { type: String, unique: true },
  birthday: { type: String, default: '01/01/2000' },
  profilePic: { type: String, default: 'https://www.gravatar.com/avatar/'},
  contactInfo: {type: Number, default: 1111111111},
  totalPoints: { type: Number, default: 0 },
  //notifications
  reviews: { type: Array, default: [] },
  rooms: { type: Array, default: [] },
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