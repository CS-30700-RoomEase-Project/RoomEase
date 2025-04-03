const express = require("express");
const router = express.Router();
const RoomState = require("../models/State"); // Import RoomState model
const User = require("../models/User");
const Room = require("../models/Room"); // Import Room model
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
            description: `New Current Room State: ${request} (Level: ${level})`,
            usersNotified: await User.findOne({ userId }), // Notify the user who made the request
            pageID: `/room-state`,
            notificationType: "Room State Change",
            origin: await User.findOne({ userId }),
        });

        await notification.save();
        await notification.propagateNotification();

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

router.get("/getAllRoomStates/:userId", async (req, res) => {
    try {
        const  { userId } = req.params; // Extract userId from request parameters

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let rooms = await Room.find({ userId: user._id });

        // TODO: READ THE CURRENT ROOM STATE FROM THE DATABASE AND RETURN IT TO THE FRONTEND
    } catch (error) {
        console.error("Error fetching all room states:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
