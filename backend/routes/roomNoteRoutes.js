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