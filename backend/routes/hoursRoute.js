const express = require("express");
const router = express.Router();
const RoomState = require("../models/State"); // Ensure this is the correct model
const User = require("../models/User");
const Notification = require("../models/Notification");

// POST: Add or change quiet hours and notify users
router.post("/setQuietHours", async (req, res) => {
    try {
        const { startTime, endTime, level, userId } = req.body;

        // Validate that all required fields are provided
        if (!startTime || !endTime || !level || !userId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Get the current date and set the start and end times
        const currentDate = new Date();
        const startTimeDate = moment(currentDate).set({ hour: startTime.split(":")[0], minute: startTime.split(":")[1], second: 0 });
        const endTimeDate = moment(currentDate).set({ hour: endTime.split(":")[0], minute: endTime.split(":")[1], second: 0 });

        // Create a RoomState entry (optional, depending on your use case)
        const newRoomState = new RoomState({
            request: `Quiet Hours set from ${startTime} to ${endTime} (Level: ${level})`,
            level,
            createdAt: currentDate,
        });

        await newRoomState.save();

        // Create a notification for the users
        const notificationMessage = `Quiet Hours set from ${startTime} to ${endTime} (Level: ${level})`;
        const notification = new Notification({
            description: notificationMessage,
            usersNotified: await User.findOneAndDelete({ userId }), // Notify the user who made the request (modify as needed to notify more users)
            pageID: "/quiet-hours",
            notificationType: "Quiet Hours Change",
            origin: await User.findOne({ userId }),
        });

        await notification.save();
        await notification.propagateNotification(); // Notify users

        // Notify users 15 minutes before quiet hours begin
        const timeUntilStart = startTimeDate.diff(currentDate, "minutes");
        if (timeUntilStart <= 15 && timeUntilStart > 0) {
            setTimeout(async () => {
                const fifteenMinNotification = new Notification({
                    description: `Reminder: Quiet Hours will begin in 15 minutes at ${startTime}`,
                    usersNotified: [userId], // Modify to notify all users if needed
                    pageID: "/quiet-hours",
                    notificationType: "Quiet Hours Reminder",
                    origin: userId,
                });

                await fifteenMinNotification.save();
                await fifteenMinNotification.propagateNotification(); // Notify users
            }, (timeUntilStart - 15) * 60000); // 15 minutes before the start of quiet hours
        }

        // Notify users when quiet hours end
        const timeUntilEnd = endTimeDate.diff(currentDate, "milliseconds");
        setTimeout(async () => {
            const endNotification = new Notification({
                description: `Quiet Hours have ended at ${endTime}`,
                usersNotified: [userId], // Modify to notify all users if needed
                pageID: "/quiet-hours",
                notificationType: "Quiet Hours End",
                origin: userId,
            });

            await endNotification.save();
            await endNotification.propagateNotification(); // Notify users
        }, timeUntilEnd); // Schedule notification at the end of quiet hours

        // Respond back with the status
        res.status(201).json({
            message: "Quiet hours set, notifications scheduled.",
            roomState: newRoomState,
            notification: notification,
        });
    } catch (error) {
        console.error("Error setting quiet hours:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;