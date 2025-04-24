const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// REMOVED FOR NOW

// // Update room state: roomStatus (name), roomState (color)
// router.post("/addRoomState", async (req, res) => {
//   const { request, level, color, userId } = req.body;

//   try {
//     // Find the user's room
//     const room = await Room.findOne({ roomMembers: userId });
//     if (!room) {
//       return res.status(404).json({ message: "Room not found for user." });
//     }

//     // Update room status and color
//     room.roomStatus = request;
//     room.roomState = color;
//     await room.save();

//     res.status(200).json({ message: "Room state updated successfully." });
//   } catch (error) {
//     console.error("Error updating room state:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// });

// router.get("/getRoomState/:userId", async (req, res) => {
//     const { userId } = req.params;
  
//     try {
//       const room = await Room.findOne({ roomMembers: userId });
//       if (!room) {
//         return res.status(404).json({ message: "Room not found." });
//       }
  
//       res.status(200).json({
//         roomStatus: room.roomStatus,
//         roomState: room.roomState,
//       });
//     } catch (error) {
//       console.error("Error fetching room state:", error);
//       res.status(500).json({ message: "Server error." });
//     }
// });

// 1️⃣ ADD a new state
// POST /api/roomstate/add
router.post("/add", async (req, res) => {
  const { userId, request, level, color } = req.body;
  try {
    const room = await Room.findOne({ roomMembers: userId });
    if (!room) return res.status(404).json({ message: "Room not found." });

    // push new state and move current pointer to it
    room.roomStates.push({ request, level, color });
    // CHANGE

    // room.currentStateIndex = room.roomStates.length - 1;
    
    await room.save();

    res.json({ message: "State added." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error." });
  }
});

// 2️⃣ FETCH your “window” of timeline
// GET /api/roomstate/queue/:userId
router.get("/queue/:userId", async (req, res) => {
  try {
    const room = await Room.findOne({ roomMembers: req.params.userId });
    if (!room) return res.status(404).json({ message: "Room not found." });

    // prune anything older than 1 hour
    const cutoff = Date.now() - 1000*60*60;
    room.roomStates = room.roomStates.filter(s => s.timestamp >= cutoff);
    // fix index bounds
    room.currentStateIndex = Math.min(
      room.currentStateIndex,
      room.roomStates.length - 1
    );
    if (room.currentStateIndex < 0) room.currentStateIndex = 0;
    await room.save();

    const idx = room.currentStateIndex;
    const hist   = room.roomStates.slice(Math.max(0, idx-2), idx);
    const current= room.roomStates[idx] || null;
    const fut    = room.roomStates.slice(idx+1, idx+3);

    res.json({
      history:   hist,
      current,
      future:    fut
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error." });
  }
});

// 3️⃣ SHIFT the pointer left/right
// POST /api/roomstate/shift
router.post("/shift", async (req, res) => {
  const { userId, direction } = req.body; // direction = "left" or "right"
  try {
    const room = await Room.findOne({ roomMembers: userId });
    if (!room) return res.status(404).json({ message: "Room not found." });

    if (direction === "left" && room.currentStateIndex > 0) {
      room.currentStateIndex--;
    } else if (direction === "right" &&
               room.currentStateIndex < room.roomStates.length - 1) {
      room.currentStateIndex++;
    }
    await room.save();
    res.json({ currentStateIndex: room.currentStateIndex });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error." });
  }
});
  
// 4️⃣ CLEAR the current state → Available
// POST /api/roomstate/clear
router.post("/clear", async (req, res) => {
  const { userId } = req.body;
  try {
    const room = await Room.findOne({ roomMembers: userId });
    if (!room) return res.status(404).json({ message: "Room not found." });

    // Mark “no current slot,” client will fall back to “Available”
    room.currentStateIndex = -1;
    await room.save();

    res.json({ message: "Cleared to Available." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
