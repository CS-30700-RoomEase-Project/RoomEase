const express = require("express");
const router = express.Router();
const RoomState = require("../models/Room"); // Import RoomState model
const User = require("../models/User");
const Notification = require("../models/Notification");

// POST: Add a new room state request and notify users
router.post("/addRoomState", async (req, res) => {
    try {
        const { request, level, userId } = req.body;

        // Create new RoomState entry
        const newRoomState = new RoomState({
            request,
            level,
            createdAt: new Date(),
        });

        await newRoomState.save();

        // Create a notification for all users (or specific ones)
        const notification = new Notification({
            message: `New Current Room State: ${request} (Level: ${level})`,
            usersNotified: [userId], // Notify the user who made the request
        });

        await notification.save();

        // Update user's notification list
        const user = await User.findOne({ userId });

        if (user) {
            user.notifications.push(notification._id);
            await user.save();
        }

        res.status(201).json({ message: "Room state request added and users notified." });
    } catch (error) {
        console.error("Error adding room state request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET: Retrieve all room state requests (queue)
router.get("/getRoomStateQueue", async (req, res) => {
    try {
        const queue = await RoomState.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(queue);
    } catch (error) {
        console.error("Error fetching room state queue:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
