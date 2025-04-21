const express = require('express');
const Rules = require('../models/Rules');
const User = require('../models/User');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

const router = express.Router();

// Route to add a new rule to a room
router.post('/add/:roomID', async (req, res) => {
    try {
        const newRule = req.body.newRule;
        const roomID  = req.params.roomID;
        console.log(roomID);
        const room = await Room.findById(roomID);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.rules.push(newRule);
        await Room.findByIdAndUpdate(roomID, room);

        res.status(201).json({ newRule });
        

    } catch (error) {
        console.error("Error adding rule:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.post('/getList/:roomID', async (req, res) => {
    try {
        const roomID  = req.params.roomID;
        const room = await Room.findById(roomID);
        console.log(roomID);
        
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json(room.rules);
    } catch (error) {
        console.error("Error adding rule:", error);
        res.status(500).json({ message: "Server error", error });
    }
})

router.post('/edit/:roomID', async (req, res) => {
    try {
      const { oldText, newText } = req.body; // Get the old and new rule text
      const roomID = req.params.roomID; // Get the roomID from the URL params
  
      const room = await Room.findById(roomID);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Find the rule in the room and update it
      const ruleIndex = room.rules.findIndex(rule => rule === oldText);
      if (ruleIndex !== -1) {
        room.rules[ruleIndex] = newText; // Update the rule
        await room.save();
        return res.status(200).json({ message: "Rule updated successfully" });
      } else {
        return res.status(404).json({ message: "Rule not found" });
      }
    } catch (error) {
      console.error("Error editing rule:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
// Route to remove a rule from a room
router.post('/remove/:roomID', async (req, res) => {
    try {
      const { text } = req.body; // Get the rule text to remove
      const roomID = req.params.roomID; // Get the room ID from the URL params
  
      const room = await Room.findById(roomID);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Remove the rule from the room
      const updatedRules = room.rules.filter(rule => rule !== text);
      
      // Update the room's rules in the database
      room.rules = updatedRules;
      await room.save();
  
      res.status(200).json({ message: "Rule removed successfully" });
    } catch (error) {
      console.error("Error removing rule:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

module.exports = router;

