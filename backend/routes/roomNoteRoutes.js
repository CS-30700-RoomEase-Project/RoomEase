const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import User model
const Room  = require('../models/Room');
const Notification = require('../models/Notification');

router.post('/add/:roomID', async (req, res) => {
    try {
      const note = req.body.note;
      const roomID = req.params.roomID;
      const room = await Room.findById(roomID);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      room.bulletinNotes.unshift(note);
      await Room.findByIdAndUpdate(roomID, room);

      res.status(201).json({ note });

    } catch (error) {
      console.error('Error creating room note:', error);
      res.status(500).json({ error: 'Server error while adding room note' });
    }
  });

router.post('/getList/:roomID', async (req, res) => {
    try {
      const roomID = req.params.roomID;
      const room = await Room.findById(roomID);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      res.json(room.bulletinNotes);
    } catch (error) {
      console.error('Error fetching bulletin notes list', error);
      res.status(500).json({ error: 'Server error while fetching bulletin notes list' });
    }
});

router.post('/getListMaster/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Assuming user.rooms is an array of room references (with _id)
    const roomIds = user.rooms.map(room => (room._id ? room._id : room));
    // Fetch all rooms that the user is in
    const rooms = await Room.find({ _id: { $in: roomIds } }).select('roomName bulletinNotes');
    
    // Group notes by room
    const aggregatedNotes = {};
    rooms.forEach(room => {
      aggregatedNotes[room._id] = {
        roomName: room.roomName,
        notes: room.bulletinNotes // assuming bulletinNotes is an array
      };
    });
    
    res.json(aggregatedNotes);
  } catch (error) {
    console.error('Error fetching aggregated bulletin notes:', error);
    res.status(500).json({ error: 'Server error while fetching aggregated bulletin notes' });
  }
});

router.post('/remove/:roomID/', async (req, res) => {
    try {

      const roomID = req.params.roomID;
      const { index } = req.body;
      const room = await Room.findById(roomID);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      if (index >= 0 && index < room.bulletinNotes.length) {
        room.bulletinNotes.splice(index, 1);
        await room.save();
        res.json({ success: true });
      }
      else {
        res.status(400).json({ error: 'Invalid index'});
      }
    } catch (error) {
      console.error('Error deleting bulletin note:', error);
      res.status(500).json({ error: 'Server error while deleting bulletin note' });
    }
  });

module.exports = router;