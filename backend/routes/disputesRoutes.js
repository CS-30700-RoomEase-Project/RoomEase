const express = require("express");
const router  = express.Router();
const Room    = require("../models/Room");

// 1️⃣ ADD a new dispute
router.post("/add", async (req, res) => {
  const { roomId, description } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  if (room.currentDisputeIndex < 0) {
    room.currentDisputeIndex = 0;
  }

  room.disputes.push({ description });
  await room.save();
  res.json({ message: "Dispute added." });
});

// 2️⃣ FETCH current + next
// GET /api/disputes/queue/:roomId
router.get("/queue/:roomId", async (req, res) => {
  const room = await Room.findById(req.params.roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  const idx = room.currentDisputeIndex;
  const current = idx >= 0 && idx < room.disputes.length
    ? room.disputes[idx]
    : null;
  const next = idx + 1 < room.disputes.length
    ? room.disputes[idx + 1]
    : null;

  res.json({ current, next });
});

// 3️⃣ SHIFT the pointer left/right
router.post("/shift", async (req, res) => {
  const { roomId, direction } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  const i = room.currentDisputeIndex;
  if (direction === "left"  && i > 0)                 room.currentDisputeIndex--;
  if (direction === "right" && i + 1 < room.disputes.length) room.currentDisputeIndex++;

  await room.save();
  res.json({ currentDisputeIndex: room.currentDisputeIndex });
});

// 4️⃣ CLEAR the current dispute → remove it
router.post("/clear", async (req, res) => {
  const { roomId } = req.body;
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: "Room not found." });

  const idx = room.currentDisputeIndex;
  if (idx >= 0 && idx < room.disputes.length) {
    room.disputes.splice(idx, 1);
    // point at same index (which now holds the next item), or back up if at end
    room.currentDisputeIndex = Math.min(idx, room.disputes.length - 1);
  } else {
    room.currentDisputeIndex = -1;
  }

  await room.save();
  res.json({ message: "Cleared current dispute." });
});

module.exports = router;
