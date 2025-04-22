const mongoose = require('mongoose');
const Room = require('./Room');

// Description and points mappings
const descriptionMap = {
  completeChore: 'Complete a chore',
  checkBills: 'Check how much you owe in bills',
  reviewRules: 'Review the house rules',
  buyGrocery: 'Buy a grocery item',
  sendChat: 'Send a chat to check in on your roommates',
};

const pointMap = {
  completeChore: 3,
  checkBills: 1,
  reviewRules: 1,
  buyGrocery: 3,
  sendChat: 2,
};

// Valid quest types
const questTypes = Object.keys(pointMap);

// Schema definition
const RoomQuestSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  type: {
    type: String,
    enum: questTypes,
    required: true,
  },
  description: { type: String, required: true },
  points: { type: Number, required: true },
}, { timestamps: true });

// Pre-validate hook to auto-fill description and points
RoomQuestSchema.pre('validate', function (next) {
  if (!this.description) {
    this.description = descriptionMap[this.type];
  }
  if (!this.points) {
    this.points = pointMap[this.type] || 0;
  }
  next();
});

// Method to award points to a user in a room and delete this quest
// Method: Award points and delete quest IF type matches
RoomQuestSchema.methods.awardPointsToUserIfTypeMatches = async function (expectedType, userId) {
    if (this.type !== expectedType) return false;
  
    const room = await Room.findById(this.room);
    if (!room) throw new Error('Room not found');
  
    // Ensure room.points is a Map
    if (!(room.points instanceof Map)) {
      room.points = new Map(Object.entries(room.points || {}));
    }
  
    const currentPoints = room.points.get(userId) || 0;
    const newPoints = currentPoints + this.points;
  
    room.points.set(userId, newPoints);
    room.markModified('points');
    room.points = Object.fromEntries(room.points);
  
    await room.save();
    await this.deleteOne();
  
    return true; // success
};
  

// Static helper: Get N random quest types
RoomQuestSchema.statics.getRandomQuestTypes = function (n = 3) {
  const shuffled = [...questTypes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// Static helper: Generate and save quest docs for a room
RoomQuestSchema.statics.generateQuestsForRoom = async function (roomId, n = 3) {
    const types = this.getRandomQuestTypes(n);
    
    const quests = await Promise.all(
      types.map(type => this.create({
        room: roomId,
        type,
        description: descriptionMap[type],
        points: pointMap[type],
      }))
    );
  
    return quests; // Now contains real Mongoose docs with _id
};
  

module.exports = mongoose.model('RoomQuest', RoomQuestSchema);
