const express = require('express');
const router = express.Router();
const { Task, Bill } = require('../models/Tasks');
const Room = require('../models/Room');

/**
 * GET all bills for a specific room
 * GET /api/bills/getBills/:roomId
 */
router.get('/getBills/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    // Find the room to get its tasks array
    const room = await Room.findById(roomId).select('tasks');
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    // Find only the tasks in the room's tasks array that are type 'Bill'
    const bills = await Task.find({ _id: { $in: room.tasks }, type: 'Bill' });
    res.json(bills.length ? bills : []);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * POST create a new Bill for a specific room
 * POST /api/bills/addBill/:roomId
 */
router.post('/addBill/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, amount, dueDate, responsible, paymaster } = req.body;

    // Create a new Bill
    const newBill = new Bill({
      title,
      amount,
      dueDate,
      responsible,
      paymaster
    });
    await newBill.save();

    // Push the new Bill's ID into the room's tasks array
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $push: { tasks: newBill._id } },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Server error while creating bill' });
  }
});

/**
 * PUT update an existing bill
 * PUT /api/bills/updateBill/:billId
 */
router.put('/updateBill/:billId', async (req, res) => {
  try {
    const { billId } = req.params;
    const updatedBill = await Bill.findByIdAndUpdate(billId, req.body, { new: true });
    if (!updatedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Server error while updating bill' });
  }
});

/**
 * DELETE a bill (also remove from room's tasks array)
 * DELETE /api/bills/deleteBill/:billId/:roomId
 */
router.delete('/deleteBill/:billId/:roomId', async (req, res) => {
  try {
    const { billId, roomId } = req.params;

    // Delete the bill
    const deletedBill = await Bill.findByIdAndDelete(billId);
    if (!deletedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Remove the bill ID from the room's tasks array
    await Room.findByIdAndUpdate(roomId, { $pull: { tasks: billId } });

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Server error while deleting bill' });
  }
});

module.exports = router;
