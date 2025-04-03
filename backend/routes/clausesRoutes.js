const express = require('express');
const Clause = require('../models/Clause');
const User = require('../models/User');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

const router = express.Router();

// Route to add a new clause to a room
router.post('/addClause/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const { createdBy, text } = req.body; // Expect createdBy and text to be passed in body

    console.log("Received data:", { roomId, createdBy, text }); // Add this log for debugging

    try {
        // Validate user and room existence
        let user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Create a new clause
        const newClause = new Clause({
            roomId,
            createdBy,
            text
        });
        await newClause.save();

        // Add the new clause to the room's clauses field
        room.clauses.push(newClause.text);
        await room.save();
        
        // Send the response back
        res.status(200).json({ message: "Clause added successfully", clause: newClause });
    } catch (error) {
        console.error("Error adding clause:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Route to get all clauses for a room
// Fetch clauses for a specific room
router.get('/getClauses/:roomId', async (req, res) => {
    try {
      const room = await Room.findById(req.params.roomId); // Get the room by roomId
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
  
      // Return the clauses for the room
      res.json(room.clauses);
    } catch (error) {
      console.error("Error fetching clauses:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });

// Route to remove a clause from a room
router.delete('/deleteClause/:roomId/:clauseText', async (req, res) => {
    const { roomId, clauseText } = req.params;
    
    try {
        // Find the room
        let room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Remove the clause from the room's clauses field
        room.clauses = room.clauses.filter(clause => clause !== clauseText);
        await room.save();

        res.status(200).json({ message: "Clause removed successfully", room: room });
    } catch (error) {
        console.error("Error removing clause:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Route to update a clause in a room
router.put('/updateClause/:roomId/:oldClauseText', async (req, res) => {
    const { roomId, oldClauseText } = req.params;
    const { newClauseText } = req.body;

    try {
        // Find the room
        let room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find the index of the clause
        const clauseIndex = room.clauses.indexOf(oldClauseText);
        if (clauseIndex === -1) {
            return res.status(404).json({ message: "Clause not found" });
        }

        // Update the clause
        room.clauses[clauseIndex] = newClauseText;
        await room.save();

        res.status(200).json({ message: "Clause updated successfully", room: room });
    } catch (error) {
        console.error("Error updating clause:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Route to notify members when a clause is added or updated
router.post('/notifyMembers/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const { notificationMessage, senderId } = req.body;

    try {
        // Find the room
        let room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Find all the room members except the sender
        const roomMembers = room.roomMembers.filter(member => member.toString() !== senderId);
        const notification = new Notification({
            usersNotified: roomMembers,
            description: notificationMessage,
            pageID: `/room/${roomId}`,
            origin: senderId
        });

        await notification.save();
        await notification.propagateNotification();

        res.status(200).json({ message: "Members notified successfully", notification: notification });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
