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

module.exports = router;

