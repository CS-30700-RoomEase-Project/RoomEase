const express = require('express');
const router = express.Router();
const Room = require('../models/Room');   // Adjust path
const User = require('../models/User');   // Adjust path
const mongoose = require('mongoose');

router.post('/get/:roomId', async (req, res) => {
    try {
      const roomId = req.params.roomId;
      const room = await Room.findById(roomId);
  
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      if (!room.points || room.points.size === 0) {
        return res.json([]);
      }
  
      // Convert Mongoose Map to plain object
      const pointsObj = Object.fromEntries(room.points);
  
      const sortedUsers = Object.entries(pointsObj)
        .filter(([userId]) => mongoose.Types.ObjectId.isValid(userId))
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
  
      const leaderboard = await Promise.all(
        sortedUsers.map(async ([userId, points]) => {
          const user = await User.findById(userId).select('username');
          return {
            username: user ? user.username : "Unknown User",
            totalPoints: points
          };
        })
      );
  
      res.json(leaderboard);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;
