const express = require("express");
const Rating = require("../models/Rating"); 
const router = express.Router();

router.post("/updateRating", async (req, res) => {
    const { roomId, recId, cleanRating, noiseRating, paymentRating, rulesRating } = req.body;

    // console.log("Received data for updating rating:", { roomId, recId, cleanRating, noiseRating, paymentRating, rulesRating });

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
                numRating: new Array(recId.length).fill(0) // Initialize numRating for each user
            });
        } else {
            const updateAverage = (oldArr, newArr, numArr, boolArr) => {
                return oldArr.map((val, index) => {
                    if (newArr[index] !== 0) {
                        if (!boolArr[index]) {
                            boolArr[index] = true;
                            numArr[index] += 1;
                        }
                        const weightOld = (numArr[index] - 1) / numArr[index];
                        const weightNew = 1 / numArr[index];
                        return (val * weightOld) + (newArr[index] * weightNew);
                    }
                    return val;
                });
            };
            
            // Initialize boolean array if not already initialized
            if (!rating.boolRating) {
                rating.boolRating = new Array(rating.cleanRating.length).fill(false);
            }
            
            rating.cleanRating = updateAverage(rating.cleanRating, cleanRating, rating.numRating, rating.boolRating);
            rating.noiseRating = updateAverage(rating.noiseRating, noiseRating, rating.numRating, rating.boolRating);
            rating.paymentRating = updateAverage(rating.paymentRating, paymentRating, rating.numRating, rating.boolRating);
            rating.rulesRating = updateAverage(rating.rulesRating, rulesRating, rating.numRating, rating.boolRating); 
        }

        await rating.save();

        console.log("Updated rating data:", rating);
        res.status(200).json({ message: "Rating updated successfully", rating });
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;