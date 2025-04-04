const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Update room state: roomStatus (name), roomState (color)
router.post("/addRoomState", async (req, res) => {
  const { request, level, color, userId } = req.body;

  try {
    // Find the user's room
    const room = await Room.findOne({ roomMembers: userId });
    if (!room) {
      return res.status(404).json({ message: "Room not found for user." });
    }

    // Update room status and color
    room.roomStatus = request;
    room.roomState = color;
    await room.save();

    res.status(200).json({ message: "Room state updated successfully." });
  } catch (error) {
    console.error("Error updating room state:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/getRoomState/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const room = await Room.findOne({ roomMembers: userId });
      if (!room) {
        return res.status(404).json({ message: "Room not found." });
      }
  
      res.status(200).json({
        roomStatus: room.roomStatus,
        roomState: room.roomState,
      });
    } catch (error) {
      console.error("Error fetching room state:", error);
      res.status(500).json({ message: "Server error." });
    }
});
  
module.exports = router;
