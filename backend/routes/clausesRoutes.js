const express = require('express');
const Clause = require('../models/Clause');
const User = require('../models/User');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

const router = express.Router();

// Route to add a new clause to a room
router.post('/add/:roomID', async (req, res) => {
    try {
        const newClause = req.body.newClause;
        const roomID  = req.params.roomID;
        console.log(roomID);
        const room = await Room.findById(roomID);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.clauses.push(newClause);
        await Room.findByIdAndUpdate(roomID, room);

        res.status(201).json({ newClause });
        

    } catch (error) {
        console.error("Error adding clause:", error);
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

        res.json(room.clauses);
    } catch (error) {
        console.error("Error adding clause:", error);
        res.status(500).json({ message: "Server error", error });
    }
})

router.post('/edit/:roomID', async (req, res) => {
    try {
      const { oldText, newText } = req.body; // Get the old and new clause text
      const roomID = req.params.roomID; // Get the roomID from the URL params
  
      const room = await Room.findById(roomID);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Find the clause in the room and update it
      const clauseIndex = room.clauses.findIndex(clause => clause === oldText);
      if (clauseIndex !== -1) {
        room.clauses[clauseIndex] = newText; // Update the clause
        await room.save();
        return res.status(200).json({ message: "Clause updated successfully" });
      } else {
        return res.status(404).json({ message: "Clause not found" });
      }
    } catch (error) {
      console.error("Error editing clause:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
// Route to remove a clause from a room
router.post('/remove/:roomID', async (req, res) => {
    try {
      const { text } = req.body; // Get the clause text to remove
      const roomID = req.params.roomID; // Get the room ID from the URL params
  
      const room = await Room.findById(roomID);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Remove the clause from the room
      const updatedClauses = room.clauses.filter(clause => clause !== text);
      
      // Update the room's clauses in the database
      room.clauses = updatedClauses;
      await room.save();
  
      res.status(200).json({ message: "Clause removed successfully" });
    } catch (error) {
      console.error("Error removing clause:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

module.exports = router;

