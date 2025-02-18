const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, userId } = req.body;

    console.log("Received data:", { username, userId }); // Add this log for debugging

    try {
        let user = await User.findOne({ userId });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new User({ username, userId });
        await user.save();
        console.log("User saved to MongoDB:", user);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
