const express = require("express");
const router  = express.Router();
const Room    = require("../models/Room");

// 1️⃣ ADD a new dispute
router.post("/add", async (req, res) => {
  const { roomId, description } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  room.disputes.push({ description });
  await room.save();
  res.json({ message: "Dispute added." });
});

// 2️⃣ FETCH your “window” of disputes
// GET /api/disputes/queue/:roomId
router.get("/queue/:roomId", async (req, res) => {
  const room = await Room.findById(req.params.roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  const idx     = Math.max(0, room.currentDisputeIndex);
  const history = room.disputes.slice(Math.max(0, idx - 2), idx);
  const current = room.disputes[idx]     || null;
  const future  = room.disputes.slice(idx + 1, idx + 3);

  res.json({ history, current, future });
});

// 3️⃣ SHIFT the pointer left/right
// POST /api/disputes/shift
router.post("/shift", async (req, res) => {
  const { roomId, direction } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  const i = room.currentDisputeIndex;
  if (direction === "left" && i > 0) {
    room.currentDisputeIndex--;
  } else if (direction === "right" && i + 1 < room.disputes.length) {
    room.currentDisputeIndex++;
  }
  await room.save();
  res.json({ currentDisputeIndex: room.currentDisputeIndex });
});

// 4️⃣ CLEAR the current dispute → none
// POST /api/disputes/clear
// Clear → remove the current dispute from the queue
router.post("/clear", async (req, res) => {
  const { roomId } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  const idx = room.currentDisputeIndex;
  if (idx >= 0 && idx < room.disputes.length) {
    // remove the current item
    room.disputes.splice(idx, 1);
    // adjust pointer: if we removed the last, back up one
    if (idx >= room.disputes.length) {
      room.currentDisputeIndex = room.disputes.length - 1;
    } else {
      room.currentDisputeIndex = idx;
    }
  } else {
    // nothing to clear
    room.currentDisputeIndex = -1;
  }

  await room.save();
  res.json({ message: "Cleared current dispute." });
});


module.exports = router;
