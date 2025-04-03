const express = require('express');
const router = express.Router();
const { Task, Chore, choreComment, choreSwap } = require('../models/Tasks'); // Import Chore and task models
const User = require('../models/User'); // Import User model
const Room = require('../models/Room'); // Import the Room model

// Create a new chore swap request
router.post("/createSwapRequest", async (req, res) => {
    try {
        const { initiatorId, receiverId, initiatorChores, receiverChores, permanent, room } = req.body;

        // Ensure all required fields are present
        if (!initiatorId || !receiverId || !room || !initiatorChores.length || !receiverChores.length) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify users exist
        const initiator = await User.findById(initiatorId);
        const receiver = await User.findById(receiverId);
        if (!initiator || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify room exists
        const roomExists = await Room.findById(room);
        if (!roomExists) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Verify chores exist and are valid
        for (const chore of [...initiatorChores, ...receiverChores]) {
            console.log("chore", chore);
            const exists = await Chore.findById(chore._id);
            console.log("exists", exists);
            if (!exists) {
                return res.status(404).json({ message: `Chore with ID ${chore._id} not found` });
            }
        }

        //console.log("id:", initiatorChores[0].chore._id);
        console.log("position:", initiatorChores[0].position);
        console.log("count:", initiatorChores[0].count);

        // Create a new chore swap request
        const newSwapRequest = new choreSwap({
            initiator: initiatorId,
            receiver: receiverId,
            initiatorChores: initiatorChores.map(chore => ({
                chore: chore._id,
                order: chore.position,
                count: chore.count || 1
            })),
            receiverChores: receiverChores.map(chore => ({
                chore: chore._id,
                order: chore.position,
                count: chore.count || 1
            })),
            permanent
        });

        // Save the swap request
        await newSwapRequest.save();

        // Add the swap request to the room's choreSwaps array
        roomExists.choreSwaps.push(newSwapRequest._id);
        await roomExists.save();

        await newSwapRequest.requestNotification(room);

        res.status(201).json({ message: "Chore swap request created successfully", swapRequest: newSwapRequest });
    } catch (error) {
        console.error("Error creating chore swap request:", error);
        res.status(500).json({ message: "Server error while processing swap request" });
    }
});

// Accept a chore swap request and swap the users in chore orders
router.post("/acceptSwapRequest", async (req, res) => {
    try {
        const { swapRequestId, roomId } = req.body;
        console.log(swapRequestId, roomId);

        // Find the swap request
        const swapRequest = await choreSwap.findById(swapRequestId).populate("initiatorChores.chore receiverChores.chore");
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        await swapRequest.acceptNotification(roomId);

        // Ensure the request has not already been accepted
        if (swapRequest.accepted) {
            return res.status(400).json({ message: "Swap request already accepted" });
        }

        // Iterate over the initiator's chores and swap users
        for (const initiatorChore of swapRequest.initiatorChores) {
            const chore = await Chore.findById(initiatorChore.chore._id);
            if (!chore) {
                return res.status(404).json({ message: `Chore with ID ${initiatorChore.chore._id} not found` });
            }

            // Find the correct position in the order array
            if (chore.order[initiatorChore.order - 1] && chore.order[initiatorChore.order - 1].toString() === swapRequest.initiator.toString()) {
                chore.order[initiatorChore.order - 1] = swapRequest.receiver; // Swap the initiator with receiver
                await chore.save();
            }
        }

        // Iterate over the receiver's chores and swap users
        for (const receiverChore of swapRequest.receiverChores) {
            const chore = await Chore.findById(receiverChore.chore._id);
            if (!chore) {
                return res.status(404).json({ message: `Chore with ID ${receiverChore.chore._id} not found` });
            }

            // Find the correct position in the order array
            if (chore.order[receiverChore.order - 1] && chore.order[receiverChore.order - 1].toString() === swapRequest.receiver.toString()) {
                chore.order[receiverChore.order - 1] = swapRequest.initiator; // Swap the receiver with initiator
                await chore.save();
            }
        }

        // If the swap is permanent, delete it and remove from room
        if (swapRequest.permanent) {
            await Room.findByIdAndUpdate(roomId, { $pull: { choreSwaps: swapRequestId } });
            await choreSwap.findByIdAndDelete(swapRequestId);
            return res.status(200).json({ message: "Permanent chore swap completed and removed" });
        }
        else {
            // Mark the swap request as accepted (if not permanent)
            swapRequest.accepted = true;
            await swapRequest.save();
        }

        res.status(200).json({ message: "Chore swap successfully completed", swapRequest });
    } catch (error) {
        console.error("Error accepting chore swap:", error);
        res.status(500).json({ message: "Server error while processing swap request" });
    }
});


router.post("/rejectSwapRequest", async (req, res) => {
    try {
        const { swapRequestId, roomId } = req.body;

        console.log(swapRequestId, roomId);
        // Ensure required data is provided
        if (!swapRequestId || !roomId) {
            return res.status(400).json({ message: "Missing swapRequestId or roomId" });
        }

        const toDelete = await choreSwap.findById(swapRequestId);
        await toDelete.declineNotification(roomId);

        // Find and delete the swap request
        const swapRequest = await choreSwap.findByIdAndDelete(swapRequestId);
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        // Remove the swap request reference from the Room
        await Room.findByIdAndUpdate(roomId, { $pull: { choreSwaps: swapRequestId } });

        res.status(200).json({ message: "Swap request rejected and removed successfully" });
    } catch (error) {
        console.error("Error rejecting swap request:", error);
        res.status(500).json({ message: "Server error while rejecting swap request" });
    }
});

router.get("/getUserChoreSwaps/:roomId/:userId", async (req, res) => {
    try {
        const { roomId, userId } = req.params;

        const room = await Room.findById(roomId).populate({
            path: "choreSwaps",
            populate: [
                { path: "initiator", select: "username email" },
                { path: "receiver", select: "username email" },
                { 
                    path: "initiatorChores.chore",
                    select: "choreName description"
                },
                { 
                    path: "receiverChores.chore",
                    select: "choreName description"
                }
            ]
        });

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Filter only swaps where the user is involved (initiator or receiver)
        const userChoreSwaps = room.choreSwaps.filter(
            swap => swap.initiator._id.toString() === userId || swap.receiver._id.toString() === userId
        );

        res.status(200).json(userChoreSwaps);
    } catch (error) {
        console.error("Error fetching chore swaps:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});




// Route to mark a chore as complete and switch to the next person
router.put('/markComplete/:id/:roomId', async (req, res) => {
    try {
        const { id, roomId } = req.params;

        const chore = await Chore.findById(id);
        if (!chore) {
            return res.status(404).json({ message: "Chore not found" });
        }
        const room = await Room.findById(roomId).populate("choreSwaps");
        if (!chore.completed) {
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
            await room.save();
        }

        // **🔄 Handle choreSwaps**
        const swapsToDelete = [];

        for (const swap of await choreSwap.find({ _id: { $in: room.choreSwaps } })) {
            let initiatorUpdated = false;
            let receiverUpdated = false;

            // Restore order before removal
            function restoreChoreOrder(choreObj, person) {
                console.log("this");
                console.log(chore);
                console.log(choreObj);
                chore.order[choreObj.order - 1] = person;
            }

            // Check initiator chores
            swap.initiatorChores = swap.initiatorChores.filter(choreObj => {
                if (choreObj.chore.toString() === id && choreObj.order === chore.whoseTurn + 1) {
                    restoreChoreOrder(choreObj, swap.initiator);
                    choreObj.count -= 1;
                    initiatorUpdated = true;
                }
                return choreObj.count > 0;
            });

            // Check receiver chores
            swap.receiverChores = swap.receiverChores.filter(choreObj => {
                if (choreObj.chore.toString() === id && choreObj.order === chore.whoseTurn + 1) {
                    restoreChoreOrder(choreObj, swap.receiver);
                    choreObj.count -= 1;
                    receiverUpdated = true;
                }
                return choreObj.count > 0;
            });

            // Save chore if order was changed
            await chore.save();

            // If both initiator and receiver chores are empty, mark swap for deletion
            if (swap.initiatorChores.length === 0 && swap.receiverChores.length === 0) {
                swapsToDelete.push(swap._id);
            } else if (initiatorUpdated || receiverUpdated) {
                await swap.save();
            }
        }

        // Delete swaps that are empty
        if (swapsToDelete.length > 0) {
            // Retrieve swaps before deletion
            const swaps = await choreSwap.find({ _id: { $in: swapsToDelete } });

            // Call a function on each swap before deleting
            for (const swap of swaps) {
                await swap.completeNotification(roomId); // Replace with your actual function
            }

            // Now delete the swaps
            await choreSwap.deleteMany({ _id: { $in: swapsToDelete } });

            // Remove the deleted swaps from the room
            await Room.findByIdAndUpdate(roomId, { $pull: { choreSwaps: { $in: swapsToDelete } } });
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


// Route to delete a chore by ID
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
        const room = await Room.findByIdAndUpdate(roomId, { $pull: { tasks: id } }, { new: true }).populate("choreSwaps");
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        // **🔄 Handle choreSwaps**
        const swapsToDelete = [];

        for (const swap of await choreSwap.find({ _id: { $in: room.choreSwaps } })) {
            let initiatorUpdated = false;
            let receiverUpdated = false;

            // Remove the deleted chore from initiator chores
            swap.initiatorChores = swap.initiatorChores.filter(choreObj => {
                if (choreObj.chore.toString() === id) {
                    initiatorUpdated = true;
                    return false; // Remove this chore
                }
                return true;
            });

            // Remove the deleted chore from receiver chores
            swap.receiverChores = swap.receiverChores.filter(choreObj => {
                if (choreObj.chore.toString() === id) {
                    receiverUpdated = true;
                    return false; // Remove this chore
                }
                return true;
            });

            // If both initiator and receiver chores are empty, mark swap for deletion
            if (swap.initiatorChores.length === 0 && swap.receiverChores.length === 0) {
                swapsToDelete.push(swap._id);
            } else if (initiatorUpdated || receiverUpdated) {
                await swap.save();
            }
        }

        // Delete swaps that are empty
        if (swapsToDelete.length > 0) {
            // Retrieve swaps before deletion
            const swaps = await choreSwap.find({ _id: { $in: swapsToDelete } });

            // Call a function on each swap before deleting
            for (const swap of swaps) {
                await swap.completeNotification(roomId); // Replace with your actual function
            }

            // Now delete the swaps
            await choreSwap.deleteMany({ _id: { $in: swapsToDelete } });

            // Remove the deleted swaps from the room
            await Room.findByIdAndUpdate(roomId, { $pull: { choreSwaps: { $in: swapsToDelete } } });
        }


        res.json({ message: "Chore and associated swaps updated successfully", deletedChore });
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

router.get('/getChoreMaster/:userId', async (req, res) => {
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
