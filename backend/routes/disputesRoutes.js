const express = require("express");
const router = express.Router();
const Dispute = require("../models/Disputes");
const User = require("../models/User");
const Room = require("../models/Room");

// Route to create a new dispute
router.post("/addDispute/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;
        const { createdBy, description } = req.body;

        // Validate user and room existence
        const user = await User.findById(createdBy);
        const room = await Room.findById(roomId);
        if (!user || !room) {
            return res.status(404).json({ error: "User or Room not found" });
        }

        const newDispute = new Dispute({
            roomId,
            createdBy,
            description,
        });

        await newDispute.save();

        res.status(201).json({ message: "Dispute created successfully!", dispute: newDispute });
    } catch (error) {
        console.error("Error creating dispute:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to update a dispute's status
router.put("/updateDispute/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["Open", "In Progress", "Resolved"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const updatedDispute = await Dispute.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedDispute) {
            return res.status(404).json({ message: "Dispute not found" });
        }

        res.status(200).json(updatedDispute);
    } catch (error) {
        console.error("Error updating dispute:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to delete a dispute
router.delete("/deleteDispute/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDispute = await Dispute.findByIdAndDelete(id);
        if (!deletedDispute) {
            return res.status(404).json({ error: "Dispute not found" });
        }

        res.json({ message: "Dispute deleted successfully", deletedDispute });
    } catch (error) {
        console.error("Error deleting dispute:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to get all disputes in a room
router.get("/getDisputes/:roomId", async (req, res) => {
    try {
        const { roomId } = req.params;

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        const disputes = await Dispute.find({ roomId }).populate("createdBy", "username");

        res.json(disputes);
    } catch (error) {
        console.error("Error fetching disputes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to vote on a dispute
router.post("/vote/:id/:userId", async (req, res) => {
    try {
        const { id, userId } = req.params;
        const { vote } = req.body; // true (in favor) or false (against)

        if (typeof vote !== "boolean") {
            return res.status(400).json({ error: "Invalid vote value" });
        }

        const dispute = await Dispute.findById(id);
        if (!dispute) {
            return res.status(404).json({ error: "Dispute not found" });
        }

        dispute.votes.set(userId, vote);
        await dispute.save();

        res.status(200).json({ message: "Vote recorded successfully", dispute });
    } catch (error) {
        console.error("Error voting on dispute:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
