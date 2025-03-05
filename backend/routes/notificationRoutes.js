const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import User model
const Notification = require("../models/Notification");

//delete notification from a user's inbox
router.delete("/removeNotification/:userId/:notifId", async (req, res) => {
    const { userId, notifId } = req.params;

    try {
        // Step 1: Find the user and remove the notification from their notifications array
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the notification from the user's notifications array
        user.notifications = user.notifications.filter((notif) => notif.toString() !== notifId);

        // Save the updated user
        await user.save();

        // Step 2: Find the notification and remove the user from its usersNotified array
        const notification = await Notification.findById(notifId);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Remove the user from the notification's usersNotified array
        notification.usersNotified = notification.usersNotified.filter((user) => user.toString() !== userId);

        // Save the updated notification
        await notification.save();

        // Step 3: Check if the usersNotified array is empty, and if so, delete the notification
        if (notification.usersNotified.length === 0) {
            await notification.deleteOne();
            return res.json({ message: "Notification removed and deleted because no users are notified." });
        }

        res.json({ message: "Notification removed from user and usersNotified list." });
    } catch (error) {
        console.error("Error removing notification:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// GET notifications for a specific user
router.get("/getNotifications/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        console.log(userId);

        console.log("10");

        // Find the user and populate their notifications
        const user = await User.findOne({ userId }).populate("notifications");

        console.log("15");
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.notifications || user.notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user" });
        }

        res.json(user.notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
