const express = require('express');
const router = express.Router();
const { Grocery } = require('../models/Tasks');
const User = require('../models/User'); // Import User model
const Room  = require('../models/Room');

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
      
      let updatedItem = req.body;
      
      updatedItem = await Grocery.findByIdAndUpdate(updatedItem._id, updatedItem, {new: true});

      res.status(200).json(updatedItem);

    } catch (error) {
      console.error('Error creating grocery:', error);
      res.status(500).json({ error: 'Server error while creating grocery' });
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
      room.tasks.forEach(task => {
        if (task.type === 'Grocery') {
          groceries.push(task);
          console.log(task.type);
        }
      });

      res.json(groceries);
    } catch (error) {
      console.error('Error fetching grocery list', error);
      res.status(500).json({ error: 'Server error while fetching grocery list' });
    }
  });

module.exports = router;