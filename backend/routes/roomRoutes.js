const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');

const router = express.Router();

router.post('/createRoom', async (req, res) => {
    const { userId, roomName, groupPic, settings } = req.body;

    console.log("Received data:", { userId, roomName, groupPic, settings}); // Add this log for debugging

    try {
        let user = await User
            .findOne({ userId })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newRoom = new Room({ roomName, groupPic, settings });
        newRoom.roomId = newRoom._id;
        await newRoom.save();
        console.log("Room saved to MongoDB:", newRoom);

        // Add the room to the user's list of rooms
        user.rooms.push(newRoom);
        await user.save();

        // Add the user to list of room members

        newRoom.roomMembers.push(userId);
        await newRoom.save();

        res.status(200).json({ message: "Room created successfully", userData: user, room: newRoom });
    }
    catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/getRoom', async( req, res) => {
    const { roomId, userId } = req.query;
    try {
        // Find the room
        let room = await Room.findOne({ _id: roomId });
        console.log("Room found:", room);
        // Check if the room exists
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        
        // Check if the user is in the room, send the data if they are
        if (room.roomMembers.includes(userId)) {
            return res.status(200).json({ message: "User is in the room", room: room });
        } else {
            console.log(room.roomMembers);
            return res.status(404).json({ message: "Access Denied: User is not a member of this room" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/getMembers/:roomId', async (req, res) => {
    const { roomId } = req.params;
    
    try {
        // Find the room by ID
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Get user details for each member in the room
        const users = await User.find({ userId: { $in: room.roomMembers } }, '_id username email');

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching room members:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;