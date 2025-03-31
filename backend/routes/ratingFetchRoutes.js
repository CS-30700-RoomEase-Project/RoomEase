const express = require("express");
const Rating = require("../models/Rating");
const router = express.Router();

router.get("/getRatings", async (req, res) => {
    const { roomId } = Object.fromEntries(
        Object.entries(req.query).map(([key, value]) => [key, value.trim()])
    );
    if (!roomId) return res.status(400).json({ message: "Missing roomId parameter" });

    try {
        const rating = await Rating.findOne({ roomId });
        if (!rating) return res.status(404).json({ message: "No rating found for this room" });

        res.status(200).json({ rating });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
