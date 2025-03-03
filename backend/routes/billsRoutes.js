const express = require('express');
const router = express.Router();
const { Bill } = require('../models/Tasks');

// GET all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Server error while fetching bills' });
  }
});

// GET a single bill by ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: 'Server error while fetching bill' });
  }
});

// POST create a new bill
router.post('/', async (req, res) => {
  try {
    const { title, amount, dueDate, responsible } = req.body;
    const newBill = new Bill({ title, amount, dueDate, responsible });
    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Server error while creating bill' });
  }
});


// PUT update an existing bill
router.put('/:id', async (req, res) => {
  try {
    const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(updatedBill);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Server error while updating bill' });
  }
});


// DELETE a bill
router.delete('/:id', async (req, res) => {
  try {
    const deletedBill = await Bill.findByIdAndDelete(req.params.id);
    if (!deletedBill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Server error while deleting bill' });
  }
});

module.exports = router;
