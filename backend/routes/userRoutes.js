const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const fs = require('fs');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, userId } = req.body;

    console.log("Received data:", { username, userId }); // Add this log for debugging

    try {
        let user = await User.findOne({ userId });
        if (user) {

            //add notifications to the database if they aren't there yet
            if (user.notifications.length === 0) {
                user.notifications = [];
                await user.save();
            }

            const userData = {
                username: user.username,
                userId: user.userId,
                birthday: user.birthday,
                profilePic: user.profilePic,
                contactInfo: user.contactInfo,
                totalPoints: user.totalPoints,
                notifications: user.notifications,
                reviews: user.reviews,
                rooms: user.rooms,
                //room Cosmetics
                //notification settings
                chatFilter: user.chatFilter,
            // Add other fields as necessary
            };
            console.log("User data sent in response:", userData);
            return res.status(200).json({ message: "User already exists", userData });
        }

        user = new User({ username, userId });
        await user.save();
        console.log("User saved to MongoDB:", user);
        const userData = {
            username: user.username,
            userId: user.userId,
            profilePic: user.profilePic,
            birthday: user.birthday,
            contactInfo: user.contactInfo,
            totalPoints: user.totalPoints,
            notifications: user.notifications,
            reviews: user.reviews,
            rooms: user.rooms,
            //room Cosmetics
            //notification settings
            chatFilter: user.chatFilter,
        // Add other fields as necessary
        };
        res.status(200).json({ message: "User registered successfully", userData });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.post('/createRoom', async (req, res) => {
    console.log("Received fsdjsifjosdjafoijdsonfjpsddoifjsopdfjiskdfio");
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

        res.status(200).json({ message: "Room created successfully", room: newRoom });
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
            return res.status(200).json({ message: "User is in the room", room });
        } else {
            console.log(room.roomMembers);
            return res.status(404).json({ message: "Access Denied: User is not a member of this room" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
module.exports = router;
