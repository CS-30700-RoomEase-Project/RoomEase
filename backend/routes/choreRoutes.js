const express = require('express');
const router = express.Router();
const { Task, Chore, choreComment } = require('../models/Tasks'); // Import Chore and task models
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

        if (!chore.completed) {
            const room = await Room.findById(roomId);
            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            const userId = chore.order[chore.whoseTurn];

            if (!userId) {
                return res.status(400).json({ message: "Invalid turn order" });
            }

            // Step 4: Get the difficulty-based points
            const difficultyPoints = room.chorePoints.get(chore.difficulty) || 0;

            room.points.set(userId, (room.points.get(userId) || 0) + difficultyPoints);

            console.log(room.points);
            // Save the updated room document
            await room.save();
        }

        // Call the complete method
        await chore.complete(roomId);

        res.status(200).json({ message: "Chore marked as complete (or switched if recurring)", chore });
    } catch (error) {
        console.error("Error marking chore as complete:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/putPoints/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const updatedPoints = req.body; // Expecting an object { Easy: X, Medium: Y, Hard: Z }

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { chorePoints: updatedPoints }, 
            { new: true } // Returns the updated document
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found." });
        }

        res.json({ message: "Chore points updated successfully!" });
    } catch (error) {
        console.error("Error updating points:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//route to update a chore by id
router.put('/updateChore/:id', async (req, res) => {
    console.log("Updating chore");
    const { id } = req.params;
    console.log(id);

    const { name, description, turns, firstTurn, dueDate, recurrenceDays, difficulty } = req.body;

    try {
        // Find and update the chore
        const updatedChore = await Chore.findByIdAndUpdate(
            id,
            { 
                choreName: name, 
                description: description, 
                order: turns, 
                whoseTurn: firstTurn,
                dueDate, // Directly storing the ISO-formatted due date
                recurringDays: recurrenceDays || 0, // Default to non-recurring if not provided
                difficulty: difficulty
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

router.get('/getPoints/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;

        const points = await Room.findById(roomId).select('-_id chorePoints');
        if (!points) {
            return res.status(404).json({ message: "Room not found." });
        }

        //return chorePoints
        res.json(points);
    } catch (error) {
        console.error("Error fetching points:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getChores/:roomId/', async (req, res) => {
    try {
        const { roomId } = req.params;
        // Find the room and get its tasks array
        const room = await Room.findById(roomId).select('tasks');
        if (!room) {
            return res.status(404).json({ message: "Room not found." });
        }
        // Find only the tasks that are in the room's tasks array and are of type 'Chore'
        const chores = await Task.find({ _id: { $in: room.tasks }, type: 'Chore' })
            .populate('order', 'username') // Populate order field with usernames
            .populate({
                path: 'comments',
                populate: {
                    path: 'creator',
                    select: 'username' // Select only the username of the creator
                }
            });

        if (!chores.length) {
            return res.status(404).json({ message: "No chores found for this room." });
        }

        res.json(chores);
    } catch (error) {
        console.error("Error fetching chores:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/getChoresMaster/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const rooms = await User.findOne({ userId: userId }).populate('rooms');
        if (!rooms) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Find only the tasks that are in the rooms' tasks arrays and are of type 'Chore'
        // Gather all tasks arrays from each room into one array
        const allRoomTasks = rooms.rooms.reduce((acc, room) => acc.concat(room.tasks), []);
        const chores = await Task.find({ _id: { $in: allRoomTasks }, type: 'Chore' })
            .populate('order', 'username') // Populate order field with usernames
            .populate({
            path: 'comments',
            populate: {
                path: 'creator',
                select: 'username' // Select only the username of the creator
            }
            });

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
        const { name, description, turns, firstTurn, dueDate, recurrenceDays, difficulty } = req.body;
        console.log("recurrenceDays");
        console.log(recurrenceDays);

        // Ensure dueDate is a valid Date object
        const parsedDueDate = dueDate ? new Date(dueDate) : null;
        if (parsedDueDate && isNaN(parsedDueDate.getTime())) {
            return res.status(400).json({ error: "Invalid due date format" });
        }

        const newChore = new Chore({
            taskId: Math.floor(Math.random() * 1000000),
            creatorId: turns[0],
            choreName: name,
            order: turns,
            description: description,
            whoseTurn: firstTurn,
            dueDate: parsedDueDate,
            recurringDays: recurrenceDays || 0, // Default to non-recurring if not provided
            difficulty: difficulty,
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

router.post('/addComment', async (req, res) => {
    try {
        const {chore, creator, message, notify, roomId} = req.body;

        ///console.log("creator:", creator);

        const user = await User.findOne({userId: creator}).populate();

        console.log("userid:", user._id);
        console.log("user:", user);

        const newComment = new choreComment({
            creator: user._id,
            comment: message   
        });

        await newComment.save();

        console.log("chore:", chore);

        const updatedChore = await Chore.findByIdAndUpdate(
            chore,
            { $push: { comments: newComment._id }},
            { new: true, useFindAndModify: false }
        );

        if (!updatedChore) {
            return res.status(404).json({ error: "chore not found" });
        }

        if (notify) {
            target = await Chore.findById(chore);
            if (!target) {
                console.log("null target");
            }
            await target.commentNotification(message, roomId);
        }


        res.status(201).json({ message: "comment added successfully!", comment: newComment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/deleteComment', async (req, res) => {
    try {
        const { commentId, choreId } = req.body;

        if (!commentId || !choreId) {
            return res.status(400).json({ error: "Comment ID and Chore ID are required." });
        }

        // Remove the comment from the database
        const deletedComment = await choreComment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ error: "Comment not found." });
        }

        // Remove the comment reference from the Chore document
        await Chore.findByIdAndUpdate(choreId, { $pull: { comments: commentId } });

        res.status(200).json({ message: "Comment deleted successfully.", commentId });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post('/checkOverdue/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user and populate rooms along with tasks
        const user = await User.findOne({ userId }).populate({
            path: 'rooms'
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        let overdueCount = 0;
        let tasksChecked = [];

        for (const r of user.rooms) {
            const room = await Room.findById(r).populate('tasks');
            for (const task of room.tasks) {
                // Check if the task is an instance of Chore and overdue
                tasksChecked.push(task);
                if (task instanceof Chore && task.dueDate && new Date(task.dueDate) < new Date() && !task.completed && task.order[task.whoseTurn].toString() === user._id.toString()) {
                    await task.overDueNotification(room._id.toString()); // Call the notification method
                    overdueCount++;
                }
            }
        }

        res.status(200).json({ message: `Checked overdue chores, ${overdueCount} notifications sent.`, tasksChecked });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = router;
