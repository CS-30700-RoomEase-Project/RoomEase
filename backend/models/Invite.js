const mongoose = require('mongoose');
const User = require('./User');
const Room = require('./Room');

/**
 * This model will represent all invites sent by roommate groups
 * 
 * source: the user that sent the invite
 * reciever: the user that recieves the invite
 * room: the room that the reciever is invited to
 */
const InviteSchema = new mongoose.Schema({
    source: {type: String},
    reciever: {type: String},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'room'},
    roomName: {type: String}
}, { timestamps: true });

module.exports = mongoose.model('Invite', InviteSchema);
