const express = require('express');
const router = express.Router();
const { Task, Bill } = require('../models/Tasks');
const Room = require('../models/Room');

/**
 * GET active bills for a specific room
 * Returns bills with isPaid: false
 */
router.get('/getBills/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).select('tasks');
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    // Only active bills (not marked as paid)
    const bills = await Task.find({ _id: { $in: room.tasks }, type: 'Bill', isPaid: false });
    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * GET bills history for a specific room
 * Returns bills with isPaid: true
 */
router.get('/history/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).select('tasks');
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    const bills = await Task.find({ _id: { $in: room.tasks }, type: 'Bill', isPaid: true });
    res.json(bills);
  } catch (error) {
    console.error("Error fetching history bills:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * POST create a new bill for a specific room
 */
router.post('/addBill/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, amount, dueDate, responsible, paymaster, frequency, customFrequency } = req.body;
    const newBill = new Bill({
      title,
      amount,
      dueDate,
      responsible,
      paymaster,
      isRecurring: frequency && frequency !== "none",
      frequency: frequency && frequency !== "none" ? frequency : null,
      customFrequency: frequency === "custom" ? customFrequency : null,
      isAmountPending: amount > 0 ? false : true
    });
    await newBill.save();

    // Push the new bill's ID into the room's tasks array
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
 * DELETE a bill and remove it from the room's tasks array
 */
router.delete('/deleteBill/:billId/:roomId', async (req, res) => {
  try {
    const { billId, roomId } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(billId);
    if (!deletedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    await Room.findByIdAndUpdate(roomId, { $pull: { tasks: billId } });
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Server error while deleting bill' });
  }
});

/**
 * PUT mark a bill as paid
 * For non-recurring bills: marks as paid.
 * For recurring bills: appends price history and updates dueDate in place.
 */
router.put('/markAsPaid/:billId', async (req, res) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    const updatedBill = await bill.markAsPaid();
    res.json(updatedBill);
  } catch (error) {
    console.error('Error marking bill as paid:', error);
    res.status(500).json({ error: 'Server error while marking bill as paid' });
  }
});

/**
 * PUT finish a recurring expense
 * Finalizes a recurring bill so that it is no longer recurring.
 * This sets an isFinished flag and moves the bill into history.
 */
router.put('/finishRecurring/:billId/:roomId', async (req, res) => {
  try {
    const { billId, roomId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    if (!bill.isRecurring) {
      return res.status(400).json({ error: "Bill is not recurring" });
    }
    // Append final price history entry using the current due date.
    const currentDueDate = new Date(bill.dueDate);
    bill.priceHistory.push({ date: currentDueDate, amount: bill.amount || 0 });
    // Mark this recurring bill as finished and paid.
    bill.isFinished = true;
    bill.isPaid = true;
    await bill.save();
    // DO NOT remove it from the room's tasks array so that it appears in history.
    res.json(bill);
  } catch (error) {
    console.error("Error finishing recurring bill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * DELETE clear all bills history for a room.
 * This deletes all bills marked as paid from the database and removes them from the room's tasks array.
 */
router.delete('/clearHistory/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    // Find the room document first.
    const room = await Room.findById(roomId).select('tasks');
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    // Query for all bills (of type 'Bill') in the room's tasks that are marked as paid.
    const paidBills = await Task.find({ 
      _id: { $in: room.tasks },
      type: 'Bill',
      isPaid: true
    });
    const paidBillIds = paidBills.map(bill => bill._id);
    
    // Delete these bills from the Task collection.
    await Task.deleteMany({ _id: { $in: paidBillIds } });
    
    // Remove the deleted bill IDs from the room's tasks array.
    await Room.updateOne(
      { _id: roomId },
      { $pull: { tasks: { $in: paidBillIds } } }
    );
    
    res.json({ message: "Bill history cleared." });
  } catch (error) {
    console.error("Error clearing bill history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
