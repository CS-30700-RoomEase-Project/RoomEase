const express = require("express");
const router = express.Router();
const QuietHours = require("../models/Hours"); // Import QuietHours model
const User = require("../models/User");
const Notification = require("../models/Notification");

// POST: Add a new quiet hours request and notify users
router.post("/addQuietHours", async (req, res) => {
    try {
        const { request, level, userId } = req.body;

        // Create new QuietHours entry
        const newQuietHours = new QuietHours({
            request,
            level,
            createdAt: new Date(),
        });

        await newQuietHours.save();

        // Create a notification for all users (or specific ones)
        const notification = new Notification({
            description: `Quiet Hours Updated: ${request} (Level: ${level})`,
            usersNotified: await User.findOne({ userId }), // Notify the user who made the request
            pageID: `/quiet-hours`,
            notificationType: "Quiet Hours Change",
            origin: await User.findOne({ userId }),
        });

        await notification.save();
        await notification.propagateNotification();

        res.status(201).json({ message: "Quiet hours request added and users notified." });
    } catch (error) {
        console.error("Error adding quiet hours request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET: Retrieve all quiet hours requests (queue)
router.get("/getQuietHoursQueue", async (req, res) => {
    try {
        const queue = await QuietHours.find().sort({ createdAt: -1 }); // Sort by newest first
        res.json(queue);
    } catch (error) {
        console.error("Error fetching quiet hours queue:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
