const express = require("express");
const Room = require("../models/Room");

module.exports = (io) => {
  const router = express.Router();

  // Send a message to the group chat
  router.post("/:roomId/message", async (req, res) => {
    try {
      const { roomId } = req.params;
      const { senderId, message } = req.body;

      if (!senderId || !message) {
        return res.status(400).json({ error: "Sender ID and message are required." });
      }

      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ error: "Room not found." });

      const newMessage = {
        senderId,
        message,
        timestamp: new Date(),
      };

      // Add message to MongoDB
      room.groupChat.push(newMessage);
      await room.save();

      // Emit new message to room members
      io.to(roomId).emit("newMessage", newMessage);

      res.status(201).json({ message: "Message sent successfully.", newMessage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while sending message." });
    }
  });

  // Fetch all messages for a room
  router.get("/:roomId/messages", async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ error: "Room not found." });

      res.status(200).json({ messages: room.groupChat || [] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error while retrieving messages." });
    }
  });

  return router;
};
