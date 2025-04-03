const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const fs = require('fs');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, userId, email } = req.body;

    console.log("Received data:", { username, userId, email }); // Add this log for debugging

    try {
        let user = await User.findOne({ userId });
        if (user) {
            if (!user.email) { 
                user.email = email; // Give the user an email if it wasn't given before
            }

            //add notifications to the database if they aren't there yet
            if (user.notifications.length === 0) {
                user.notifications = [];
                await user.save();
            }

            const userData = {
                username: user.username,
                userId: user.userId,
                email: user.email,
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
                invites: user.invites
            // Add other fields as necessary
            };
            console.log("User data sent in response:", userData);
            return res.status(200).json({ message: "User already exists", userData });
        }

        user = new User({ username, userId, email });
        await user.save();
        console.log("User saved to MongoDB:", user);
        const userData = {
            username: user.username,
            userId: user.userId,
            email: user.email,
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
            invites: user.invites
        // Add other fields as necessary
        };
        res.status(200).json({ message: "User registered successfully", userData });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/getUser', async (req, res) => {
    const { userId } = req.query;
    try {
        let user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = {
            username: user.username,
            userId: user.userId,
            email: user.email,
            profilePic: user.profilePic,
            birthday: user.birthday,
            contactInfo: user.contactInfo,
            totalPoints: user.totalPoints,
            //notifications
            reviews: user.reviews,
            rooms: user.rooms,
            //room Cosmetics
            //notification settings
            chatFilter: user.chatFilter,
            invites: user.invites
        };
        // console.log("User data sent in response:", userData);
        return res.status(200).json({ message: "User data found", user: userData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
