const express = require('express');
const router = express.Router();
const { Grocery } = require('../models/Tasks');
const User = require('../models/User'); // Import User model
const Room  = require('../models/Room');
const Notification = require('../models/Notification');

router.post('/add/:roomID', async (req, res) => {
    try {
      const item = new Grocery({...req.body});
      const roomID = req.params.roomID;
      const room = await Room.findById(roomID);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      const savedItem = await item.save();
      room.tasks.push(savedItem);
      await Room.findByIdAndUpdate(roomID, room);
      res.status(201).json(savedItem);
    } catch (error) {
      console.error('Error creating grocery:', error);
      res.status(500).json({ error: 'Server error while creating grocery' });
    }
  });

  router.post('/update', async (req, res) => {
    try {
      console.log("Update payload:", req.body);
      let updatedItem = req.body;
      updatedItem = await Grocery.findByIdAndUpdate(updatedItem._id, updatedItem, { new: true });
      updatedItem = await updatedItem.populate('requesters', 'username');
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating grocery:', error);
      res.status(500).json({ error: 'Server error while updating grocery' });
    }
  });

  router.post('/remove/:roomID/:itemID', async (req, res) => {
    try {

      const roomID = req.params.roomID;
      const room = await Room.findById(roomID);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      const itemID = req.params.itemID;
      const item = await Grocery.findById(itemID);

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      
      const deletedItem = await Grocery.findByIdAndDelete(item._id);

      if (!deletedItem) {
        return res.status(404).json({ error: 'Grocery not found' });
      }

      let itemIndex = room.tasks.indexOf(item._id);
      if (itemIndex > -1) {
        room.tasks.splice(itemIndex, 1);
      }

      await Room.findByIdAndUpdate(roomID, room);

      res.json({ message: 'Grocery removed successfully' });
    } catch (error) {
      console.error('Error deleting grocery:', error);
      res.status(500).json({ error: 'Server error while deleting grocery' });
    }
  });

  // Return the grocery list
  router.post('/getList/:roomID', async (req, res) => {
    try {
      const roomID = req.params.roomID;
      const room = await Room.findById(roomID).populate('tasks');

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      
      let groceries = [];

      for (let i = 0; i < room.tasks.length; i++) {
        let task = room.tasks[i];
        if (task.type === 'Grocery') {
          task = await task.populate('requesters', 'username');
          groceries.push(task);
        }
      }
      
      res.json(groceries);
    } catch (error) {
      console.error('Error fetching grocery list', error);
      res.status(500).json({ error: 'Server error while fetching grocery list' });
    }
  });

  router.post('/request/:roomId/:itemId', async (req, res) => {
    const { roomId, itemId } = req.params;
    const { userId, description } = req.body; // userId is the custom string from the client
  
    try {
      // Find the grocery item by its id (optionally, you can verify roomId here)
      let item = await Grocery.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item not found in the specified room' });
      }
  
      // Find the user by the custom userId field
      const user = await User.findOne({ userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Ensure requesters is initialized (should be by default, but just in case)
      if (!item.requesters) {
        item.requesters = [];
      }
  
      // Convert the existing ObjectIds to strings for safe comparison
      const existingRequesters = item.requesters.map(id => id.toString());
  
      // Toggle: If user's ObjectId is already present, remove it; otherwise, add it.
      if (existingRequesters.includes(user._id.toString())) {
        // Remove the user’s ObjectId from the requesters array
        item.requesters = item.requesters.filter(id => id.toString() !== user._id.toString());
        console.log(`User ${user._id} removed from requesters.`);
      } else {
        // Add the user’s ObjectId to the requesters array
        item.requesters.push(user._id);
        console.log(`User ${user._id} added to requesters.`);
      }
  
      console.log(`Request action: ${description}`);
  
      // Save the updated item
      await item.save();
  
      item = await item.populate('requesters', 'username');

      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post("/notifyPurchased/:roomId/:itemId/", async (req, res) => {
    const { userId, description, pageID } = req.body;
    const { roomId, itemId } = req.params;
    try {
      // Optionally, get the notifying user (for origin)
      const user = await User.findOne({ userId });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Find the grocery item by its id
      const item = await Grocery.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      item.purchaser = user._id;

      await item.save();

      // Create the notification with usersNotified equal to the requesters array from the grocery item
      const notification = new Notification({
        usersNotified: item.requesters, // now using the requesters array
        description,
        pageID,
        notificationType: "Grocery",
        origin: user._id  // or set to null if not needed
      });
  
      await notification.save();
      await notification.propagateNotification();
  
      res.json({ success: true, notification });
    } catch (error) {
      console.error("Error creating grocery notification:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  

module.exports = router;