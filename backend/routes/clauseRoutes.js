const express = require('express');
const router = express.Router();
const Clause = require('../models/Clause');

// GET: fetch or create a single clauses doc for a room
router.get('/get/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    let clauseDoc = await Clause.findOne({ roomId });
    if (!clauseDoc) {
      clauseDoc = await Clause.create({ roomId, text: '' });
    }
    res.json(clauseDoc.text);
  } catch (err) {
    console.error('Error fetching clauses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT: update the clauses text for a room
router.put('/update/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { clauses } = req.body;
    if (typeof clauses !== 'string') {
      return res.status(400).json({ error: 'clauses must be a string' });
    }

    const updated = await Clause.findOneAndUpdate(
      { roomId },
      { text: clauses, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json({ message: 'Clauses saved', text: updated.text });
  } catch (err) {
    console.error('Error saving clauses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
