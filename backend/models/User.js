const mongoose = require('mongoose');
const Notification = require('./Notification');
const RoomCosmetic = require('./RoomCosmetic');
const RoomQuest = require('./RoomQuest');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: false },
  userId: { type: String, unique: true },
  email: {type: String, unique: true},
  birthday: { type: String, default: '01/01/2000' },
  profilePic: { type: String, default: 'https://www.gravatar.com/avatar/'},
  contactInfo: {type: Number, default: 1111111111},
  totalPoints: { type: Number, default: 0 },
  notifications: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }], default: [] },
  reviews: { type: Array, default: [] },
  rooms: { type: Array, default: [] },
  roomCosmetics: {type: [{type:mongoose.Schema.Types.ObjectId, ref: 'RoomCosmetic'}], default: []},
  roomQuests: {type: [{type:mongoose.Schema.Types.ObjectId, ref: 'RoomQuest'}], default: []},
  lastQuestDate: {type:Date, default: null},
  //notification settings
  chatFilter: { type: Boolean, default: false },
  invites: { type: Array, default: []}
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
// }, { timestamps: true });

// module.exports = mongoose.model('User', UserSchema);