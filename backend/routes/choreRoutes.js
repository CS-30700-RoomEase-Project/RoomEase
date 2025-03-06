const express = require('express');
const router = express.Router();
const { Task, Chore } = require('../models/Tasks'); // Import Chore and task models
const User = require('../models/User'); // Import User model
const Room = require('../models/Room'); // Import the Room model

// Route to mark a chore as complete and switch to the next person
router.put('/markComplete/:id/:roomId', async (req, res) => {
    try {
        const { id, roomId } = req.params;

        const chore = await Chore.findById(id);
        if (!chore) {
            return res.status(404).json({ message: "Chore not found" });
        }

        // Call the complete method
        await chore.complete(roomId);

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
router.delete('/delete/:id/:roomId', async (req, res) => {
    console.log("Attempting to delete chore");
    try {
        const { id, roomId } = req.params;

        // Delete the chore
        const deletedChore = await Chore.findByIdAndDelete(id);
        if (!deletedChore) {
            return res.status(404).json({ error: "Chore not found" });
        }

        // Remove the chore ID from the room's tasks array
        await Room.findByIdAndUpdate(roomId, { $pull: { tasks: id } });

        res.json({ message: "Chore deleted successfully", deletedChore });
    } catch (error) {
        console.error("Error deleting chore:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getChores/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;

        // Find the room and get its tasks array
        const room = await Room.findById(roomId).select('tasks');
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }

        // Find only the tasks that are in the room's tasks array and are of type 'Chore'
        const chores = await Task.find({ _id: { $in: room.tasks }, type: 'Chore' })
            .populate('order', 'username'); // Populate order field with usernames

        if (!chores.length) {
            return res.status(404).json({ message: "No chores found for this room." });
        }

        res.json(chores);
    } catch (error) {
        console.error("Error fetching chores:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to add a new Chore
router.post('/addChore/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params

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

        console.log("chore saved");
        // **Find the room and add the chore to its `tasks` array**
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $push: { tasks: newChore._id } }, // Add chore to the tasks array
            { new: true, useFindAndModify: false }
        );
        console.log(updatedRoom);

        if (!updatedRoom) {
            return res.status(404).json({ error: "Room not found" });
        }

        output = await newChore.createNotification(roomId);
        console.log(output);
        res.status(201).json({ message: "Chore added successfully!", chore: newChore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
