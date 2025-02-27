const express = require('express');
const router = express.Router();
const { Chore } = require('../models/Tasks'); // Import Chore model
const User = require('../models/User'); // Import User model

//route to delete a chore by id
router.delete('/:id', async (req, res) => {
    console.log("attempting delete");
    try {
        const { id } = req.params;
        const deletedChore = await Chore.findByIdAndDelete(id);
        
        if (!deletedChore) {
            return res.status(404).json({ error: "Chore not found" });
        }

        res.json({ message: "Chore deleted successfully", deletedChore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to fetch all chores
router.get('/getChores', async (req, res) => {
    console.log("getting chores");
    try {
        const chores = await Chore.find({}).populate('order', 'username'); // Populating user names
        console.log(chores);
        res.json(chores);
    } catch (error) {
        console.error("Error fetching chores:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to add a new Chore
router.post('/addChore', async (req, res) => {
    try {
        const { name, description, turns, firstTurn } = req.body;

        console.log(turns);
        console.log(firstTurn);

        // Convert user names to ObjectIds
        const users = await User.find({ username: { $in: turns } }).select('_id');
        const firstUser = await User.findOne({ username: firstTurn }).select('_id');

        if (!users.length || !firstUser) {
            console.log("Invalid users provided");
            return res.status(400).json({ error: "Invalid users provided" });
        }

        const newChore = new Chore({
            taskId: Math.floor(Math.random() * 1000000), // Unique Task ID
            creatorId: users[0]._id, // Assign first user as creator
            choreName: name,
            order: users.map(user => user._id),
            description,
            whoseTurn: users.findIndex(user => user._id.toString() === firstUser._id.toString())
        });

        await newChore.save();
        res.status(201).json({ message: "Chore added successfully!", chore: newChore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
