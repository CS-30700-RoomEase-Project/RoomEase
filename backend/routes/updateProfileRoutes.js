const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route to update the user profile
router.post("/updateProfile", async (req, res) => {
    const { userId, username, birthday, profilePic, contactInfo, totalPoints, chatFilter } = req.body;

    console.log("Received data for updating profile:", { userId, username, birthday, profilePic, contactInfo, totalPoints, chatFilter });

    try {
        let user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's data with the new values from the request
        user.username = username || user.username;
        user.birthday = birthday || user.birthday;
        user.profilePic = profilePic || user.profilePic;
        user.contactInfo = contactInfo || user.contactInfo;
        user.totalPoints = totalPoints || user.totalPoints;
        user.chatFilter = chatFilter || user.chatFilter;

        // Save the updated user data to the database
        await user.save();

        const updatedUserData = {
            username: user.username,
            userId: user.userId,
            profilePic: user.profilePic,
            birthday: user.birthday,
            contactInfo: user.contactInfo,
            totalPoints: user.totalPoints,
            reviews: user.reviews,
            chatFilter: user.chatFilter,
        };

        console.log("Updated user data:", updatedUserData); // Ensure the user data is being sent back

        res.status(200).json({ message: "Profile updated successfully", userData: updatedUserData });

    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
