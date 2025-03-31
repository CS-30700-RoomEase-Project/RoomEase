const express = require('express');
const router = express.Router();
const { Task, Bill } = require('../models/Tasks');
const Room = require('../models/Room');
const mongoose = require('mongoose');
const User = require('../models/User');             // Added: Import the User model
const Notification = require('../models/Notification'); // Added: Import Notification model

// GET active bills for a specific room
router.get('/getBills/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).select('tasks');
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    const bills = await Task.find({ _id: { $in: room.tasks }, type: 'Bill', isPaid: false });
    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET bills history for a specific room
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

// POST create a new bill for a specific room
router.post('/addBill/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    let { title, amount, dueDate, responsible, paymaster, frequency, customFrequency } = req.body;

    // Ensure responsible is an array.
    if (typeof responsible === 'string') {
      try {
        responsible = JSON.parse(responsible);
      } catch (e) {
        console.error("Error parsing responsible field:", e);
        responsible = [];
      }
    }

    // Create the new bill
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

    // Call the bill's createNotification method (like in chores)
    await newBill.createNotification(roomId);

    res.status(201).json(newBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Server error while creating bill' });
  }
});


// PUT update an existing bill
router.put('/updateBill/:billId/:roomId', async (req, res) => {
  try {
    const { billId, roomId } = req.params;
    const updatedBill = await Bill.findByIdAndUpdate(billId, req.body, { new: true });
    if (!updatedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    // Send a notification to responsible users about the update
    await updatedBill.createEditNotification(roomId);
    res.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Server error while updating bill' });
  }
});


// DELETE a bill and remove it from the room's tasks array
router.delete('/deleteBill/:billId/:roomId', async (req, res) => {
  try {
    const { billId, roomId } = req.params;
    // First, find the bill to retrieve its details for the notification
    const billToDelete = await Bill.findById(billId);
    if (!billToDelete) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    // Create a deletion notification before deleting the bill
    await billToDelete.createDeleteNotification(roomId);
    
    // Now delete the bill
    await Bill.findByIdAndDelete(billId);
    await Room.findByIdAndUpdate(roomId, { $pull: { tasks: billId } });
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Server error while deleting bill' });
  }
});

// PUT mark a bill as paid
router.put('/markAsPaid/:billId/:roomId', async (req, res) => {
  try {
    const { billId, roomId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ error: "Bill not found" });
    
    // Mark the bill as paid (for recurring bills this updates the cycle; for non-recurring, it marks as paid)
    const updatedBill = await bill.markAsPaid();
    
    // Create and propagate a "Bill Paid" notification for responsible users.
    await updatedBill.createPaidNotification(roomId);
    
    res.json(updatedBill);
  } catch (error) {
    console.error('Error marking bill as paid:', error);
    res.status(500).json({ error: 'Server error while marking bill as paid' });
  }
});


// PUT finish a recurring expense
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
    
    // Update all responsible persons as paid
    bill.responsible = bill.responsible.map(person => ({
      ...person,
      paid: true
    }));
    
    // Mark the recurring bill as finished and paid
    bill.isFinished = true;
    bill.isPaid = true;
    await bill.save();
    res.json(bill);
  } catch (error) {
    console.error("Error finishing recurring bill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// DELETE clear all bills history for a room
router.delete('/clearHistory/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId).select('tasks');
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }
    const paidBills = await Task.find({ 
      _id: { $in: room.tasks },
      type: 'Bill',
      isPaid: true
    });
    const paidBillIds = paidBills.map(bill => bill._id);
    await Task.deleteMany({ _id: { $in: paidBillIds } });
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
