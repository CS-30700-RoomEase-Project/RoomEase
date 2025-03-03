const express = require('express');
const router = express.Router();
const { Chore } = require('../models/Tasks'); // Import Chore model
const User = require('../models/User'); // Import User model

// Route to mark a chore as complete and switch to the next person
router.put('/markComplete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const chore = await Chore.findById(id);
        if (!chore) {
            return res.status(404).json({ message: "Chore not found" });
        }

        // Call the complete method
        await chore.complete();

        res.status(200).json({ message: "Chore marked as complete (or switched if recurring)", chore });
    } catch (error) {
        console.error("Error marking chore as complete:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




//route to update a chore by id
router.put('/updateChore/:id', async (req, res) => {
    console.log("Updating chore");

    const { name, description, id, turns, firstTurn, dueDate, frequency } = req.body;

    try {
        // Convert user names to ObjectIds
        const users = await Promise.all(
            turns.map(async (name) => await User.findOne({ username: name }).select('_id'))
        );
        const firstUser = await User.findOne({ username: firstTurn }).select('_id');

        if (!users.length || !firstUser) {
            console.log("Invalid users provided");
            return res.status(400).json({ error: "Invalid users provided" });
        }

        // Find and update the chore
        const updatedChore = await Chore.findByIdAndUpdate(
            id,
            { 
                choreName: name, 
                description: description, 
                order: users, 
                whoseTurn: users.findIndex(user => user._id.toString() === firstUser._id.toString()),
                dueDate, // Directly storing the ISO-formatted due date
                recurringDays: frequency || 0 // Default to non-recurring if not provided
            },
            { new: true } // Return the updated document
        );

        if (!updatedChore) {
            return res.status(404).json({ message: 'Chore not found' });
        }

        res.status(200).json(updatedChore);
    } catch (error) {
        console.error("Error updating chore:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//route to delete a chore by id
router.delete('/delete/:id', async (req, res) => {
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
    User.find({})
        .then(users => console.log(users))
        .catch(err => console.error(err));
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
        console.log("adding");
        const { name, description, turns, firstTurn, dueDate, recurrenceDays } = req.body;
        console.log("recurrenceDays");
        console.log(recurrenceDays);

        // Convert user names to ObjectIds
        const users = await Promise.all(
            turns.map(async (name) => await User.findOne({ username: name }).select('_id'))
        );
        const firstUser = await User.findOne({ username: firstTurn }).select('_id');

        if (!users.length || !firstUser) {
            return res.status(400).json({ error: "Invalid users provided" });
        }

        // Ensure dueDate is a valid Date object
        const parsedDueDate = dueDate ? new Date(dueDate) : null;
        if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ error: "Invalid due date format" });
        }

        const newChore = new Chore({
            taskId: Math.floor(Math.random() * 1000000),
            creatorId: users[0]._id,
            choreName: name,
            order: users.map(user => user._id),
            description: description,
            whoseTurn: users.findIndex(user => user._id.toString() === firstUser._id.toString()),
            dueDate: parsedDueDate,
            recurringDays: recurrenceDays || 0, // Default to non-recurring if not provided
            isComplete: false // Initialize as not completed
        });

        await newChore.save();
        res.status(201).json({ message: "Chore added successfully!", chore: newChore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
