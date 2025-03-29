const express = require("express");
const Rating = require("../models/Rating"); 
const router = express.Router();

router.post("/updateRating", async (req, res) => {
    const { roomId, recId, cleanRating, noiseRating, paymentRating, rulesRating } = req.body;

    console.log("Received data for updating rating:", { roomId, recId, cleanRating, noiseRating, paymentRating, rulesRating });

    try {
        if (!roomId || !recId || !Array.isArray(cleanRating) || !Array.isArray(noiseRating) ||
            !Array.isArray(paymentRating) || !Array.isArray(rulesRating)) {
            return res.status(400).json({ message: "Missing or invalid required fields" });
        }

        let rating = await Rating.findOne({ roomId });

        if (!rating) {
            // If no rating exists, create a new one
            rating = new Rating({
                roomId,
                recId,
                cleanRating,
                noiseRating,
                paymentRating,
                rulesRating,
                numRating: new Array(recId.length).fill(1) // Initialize numRating for each user
            });
        } else {
            const updateAverage = (oldArr, newArr, numArr, recId) => {
                return oldArr.map((val, index) => {
                    if (newArr[index] !== 0) {
                        const oldNum = numArr[index] || 1; // Default to 1 if missing
                        const newNum = oldNum + (rating[recId[index]] ? 0 : 1); // Only increment if not updated before
                        const weightOld = (oldNum - 1) / newNum;
                        const weightNew = 1 / newNum;
                        numArr[index] = newNum; // Update numRating for this index
                        return (val * weightOld) + (newArr[index] * weightNew);
                    }
                    return val; // If newArr[index] is 0, keep the old value
                });
            };

            rating.cleanRating = updateAverage(rating.cleanRating, cleanRating, rating.numRating, recId);
            rating.noiseRating = updateAverage(rating.noiseRating, noiseRating, rating.numRating, recId);
            rating.paymentRating = updateAverage(rating.paymentRating, paymentRating, rating.numRating, recId);
            rating.rulesRating = updateAverage(rating.rulesRating, rulesRating, rating.numRating, recId);
        }

        await rating.save();

        // console.log("Updated rating data:", rating);
        res.status(200).json({ message: "Rating updated successfully", rating });
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
