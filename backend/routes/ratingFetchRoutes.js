const express = require("express");
const Rating = require("../models/Rating");
const router = express.Router();

router.post("/getRating", async (req, res) => {
  const { roomId } = req.body;

  try {
    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const rating = await Rating.findOne({ roomId });

    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    // Map the ratings to user IDs (recId)
    const ratings = rating.recId.reduce((acc, userId, index) => {
      acc[userId] = {
        cleanlinessRating: rating.cleanRating[index],
        noiseLevelRating: rating.noiseRating[index],
        paymentTimelinessRating: rating.paymentRating[index],
        ruleAdherenceRating: rating.rulesRating[index]
      };
      return acc;
    }, {});

    res.status(200).json({
      roomId: rating.roomId,
      ratings: ratings // Send back ratings mapped by userId
    });
  } catch (error) {
    console.error("Error fetching rating:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
