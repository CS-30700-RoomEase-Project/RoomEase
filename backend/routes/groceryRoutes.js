const express = require('express');
const router = express.Router();
const { Grocery } = require('../models/Tasks');
const User = require('../models/User'); // Import User model
const Room  = require('../models/Room');

router.post('/add/:roomID', async (req, res) => {
    try {
      const { itemName, description } = req.body;
      const item = new Grocery({ itemName, description });
      const roomID = req.params.roomID;
      const room = await Room.findById(roomID);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const savedItem = await item.save();
      room.tasks.push(savedItem);
      await Room.findByIdAndUpdate(roomID, room);
      res.status(201).json(savedItem);
    } catch (error) {
      console.error('Error creating grocery:', error);
      res.status(500).json({ error: 'Server error while creating grocery' });
    }
  });

module.exports = router;