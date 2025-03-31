const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

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

router.get('/leaveRoom', async (req, res) => {
    console.log("--------------------------------------------------");
    const { roomId, userId } = req.query;
    let room = await Room.findOne({ _id: roomId });
    console.log("Room found:", room);
    // Check if the room exists
    if (!room) {
        return res.status(404).json({ message: "Room not found" });
    }
    let user = await User.findOne({ userId: userId });
    
    // Check if the user is in the room, leave the room if they are
    if (room.roomMembers.includes(userId)) {
        // Remove the room from the user's list of rooms
        user.rooms = user.rooms.filter(room => room._id.toString() !== roomId);
        await user.save();
        // If the user is the last person in the room, delete the room
        if (room.roomMembers.length === 1) {
            await Room.deleteOne({ _id: roomId });
            console.log("Room deleted:", roomId);
        } else { // Otherwise, just remove the user from the room
            room.roomMembers = room.roomMembers.filter(member => member.toString() !== userId);
            await room.save();
            console.log("User removed from room:", userId);

            let roomMembers = [];
            for (let i of room.roomMembers) {
                if (i != user.userId) {
                    let curr = await User.findOne({ userId: i });
                    roomMembers.push(curr._id);
                }
            }

            // Notify all other members of the room
            const memberNotificationDesc = user.username + " has left the room: " + room.roomName + "!";
            const memeberNotification = new Notification({
                usersNotified: roomMembers,
                description: memberNotificationDesc,
                pageID: `/room/${room._id}`,
                origin: user._id
            })
            
            await memeberNotification.save();
            await memeberNotification.propagateNotification();
        }
        console.log("---------------------------------------------------");
        return res.status(200).json({ message: "User successfully left!", userData: user, roomData: room });
    } else {
        console.log(room.roomMembers);
        console.log("--------------------------------------fdsdf-------------");

        return res.status(404).json({ message: "User is not a member of this room" });
    }
});

module.exports = router;