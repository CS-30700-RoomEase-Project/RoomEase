const express = require("express");
const sharp = require("sharp"); // NEW: import sharp for image processing
const User = require("../models/User");
const Room = require("../models/Room");
const Notification = require("../models/Notification");
const RoomCosmetic = require("../models/RoomCosmetic");
const RoomQuest = require('../models/RoomQuest');

const router = express.Router();

const multer = require("multer");
// Configure multer to store image in memory (for storing as Buffer in MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/createRoom", async (req, res) => {
  const { userId, roomName, groupPic, settings } = req.body;

  console.log("Received data:", { userId, roomName, groupPic, settings }); // Add this log for debugging

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newRoom = new Room({ roomName, groupPic, settings });
    newRoom.roomId = newRoom._id;
    await newRoom.save();
    console.log("Room saved to MongoDB:", newRoom);

    // Create and save the RoomCosmetic using schema defaults
    const newCosmetic = new RoomCosmetic({
      room: newRoom._id,
    });

    await newCosmetic.save();

    // Associate cosmetic with user
    user.roomCosmetics.push(newCosmetic._id);

    // Add the room to the user's list of rooms
    user.rooms.push(newRoom);
    await user.save();

    // Add the user to list of room members

    newRoom.roomMembers.push(userId);
    await newRoom.save();

    res
      .status(200)
      .json({
        message: "Room created successfully",
        userData: user,
        room: newRoom,
      });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Utility: check if two dates are on the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// API: Check if new day, and if so, generate new quests
router.post('/checkAndGenerateQuests/:userId', async (req, res) => {
  try {
    const id = req.params.userId;
    console.log("generating quests");

    const user = await User.findOne({ _id: id }).populate('roomQuests');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    const lastDate = user.lastQuestDate || new Date(0);

    if (isSameDay(today, lastDate)) {
      console.log("quests already generated today");
      return res.status(200).json({ message: 'Quests already generated today' });
    }

    if (user.roomQuests && user.roomQuests.length > 0) {
      await RoomQuest.deleteMany({ _id: { $in: user.roomQuests } });
    }
    user.roomQuests = [];
    

    const rooms = user.rooms;

    // Generate quests for all rooms
    for (const roomId of rooms) {
      const quests = await RoomQuest.generateQuestsForRoom(roomId); // returns array of quest docs
      console.log("Generated quests:", quests);
      console.log("Quest IDs:", quests.map(q => q._id));
      user.roomQuests.push(...quests.map(q => q._id));
    }

    user.lastQuestDate = today;
    await user.save();

    res.status(200).json({ message: 'New quests generated', quests: user.roomQuests });
  } catch (error) {
    console.error('Error checking/generating quests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to award points if a matching quest exists for the user
router.post('/award-quest-points', async (req, res) => {
  try {
    const { userId, roomId, questType } = req.body;
    console.log("attempting to award points");

    if (!userId || !roomId || !questType) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    // Find the user by userId
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Loop through the user's roomQuests to find a matching quest
    const matchingQuest = await RoomQuest.findOne({
      _id: { $in: user.roomQuests },
      room: roomId,
      type: questType,
    });
    console.log("matching quest: ", matchingQuest);

    if (!matchingQuest) {
      return res.status(404).json({ message: 'Matching quest not found.' });
    }

    // Award points if the quest type matches
    const success = await matchingQuest.awardPointsToUserIfTypeMatches(questType, userId);

    if (success) {
      return res.status(200).json({ message: 'Points awarded successfully!' });
    } else {
      return res.status(400).json({ message: 'Quest type does not match.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all quests for a user in a specific room
router.get('/quests-in-room', async (req, res) => {
  try {
    const { userId, roomId } = req.query;

    if (!userId || !roomId) {
      return res.status(400).json({ message: 'Missing required parameters.' });
    }

    // Find the user by userId
    console.log("potato debug");
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    console.log("debug potato");

    // Find all quests for the room in the user's roomQuests array
    const roomQuests = await RoomQuest.find({
      _id: { $in: user.roomQuests },
      room: roomId,
    });

    // If no quests are found, return a message
    if (roomQuests.length === 0) {
      return res.status(404).json({ message: 'No quests found in this room for the user.' });
    }

    // Return the list of quests
    return res.status(200).json(roomQuests);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  "/uploadRoomImage/:roomId",
  upload.single("roomImage"),
  async (req, res) => {
    try {
      const { roomId } = req.params;
      const file = req.file;
      console.log("File received:", file); // Debugging line
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const resizedBuffer = await sharp(file.buffer)
        .resize(350, 100)
        .toBuffer();

      room.roomImage = resizedBuffer;
      await room.save();

      res
        .status(200)
        .json({ message: "Room image updated successfully", roomId: room._id });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.get("/roomImage/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);

    if (!room || !room.roomImage) {
      return res.status(404).json({ message: "Room or image not found" });
    }

    res.set("Content-Type", "image/jpeg"); // or 'image/png' based on what you expect
    res.send(room.roomImage);
  } catch (error) {
    console.error("Error fetching room image:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/getRoom", async (req, res) => {
  const { roomId, userId } = req.query;
  try {
    // Find the room
    let room = await Room.findOne({ _id: roomId });
    console.log("Room found:", room);
    // Check if the room exists
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if the user is in the room, send the data if they are
    if (room.roomMembers.includes(userId)) {
      return res
        .status(200)
        .json({ message: "User is in the room", room: room });
    } else {
      console.log(room.roomMembers);
      return res
        .status(404)
        .json({ message: "Access Denied: User is not a member of this room" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/purchaseColor", async (req, res) => {
  const { userId, roomId, color } = req.body;

  if (!userId || !roomId || !color) {
    return res.status(400).json({ error: "Missing userId, roomId, or color" });
  }
  console.log("user:", userId);
  console.log("room:", roomId);
  console.log("color", color);

  try {
    // Find the room
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });
    console.log("room", room);

    // Make sure the room has a points map
    if (!room.points || !room.points.has(userId)) {
      return res.status(400).json({ error: "User points not found in room" });
    }
    console.log("points:", room.points);

    // Get user points in the room
    const currentPoints = room.points.get(userId);

    // Find the user and their RoomCosmetic
    const user = await User.findById(userId).populate("roomCosmetics");
    if (!user) return res.status(404).json({ error: "User not found" });
    console.log(user);

    const roomCosmetic = user.roomCosmetics.find(
      (rc) => rc.room.toString() === roomId
    );
    if (!roomCosmetic)
      return res.status(404).json({ error: "RoomCosmetic not found" });

    // Check if color already purchased
    if (roomCosmetic.purchased.get(color)) {
      return res.status(400).json({ error: "Color already purchased" });
    }

    const colorCost = roomCosmetic.cost.get(color);
    if (currentPoints < colorCost) {
      return res.status(400).json({ error: "Not enough points" });
    }

    // Deduct points from room's points map
    room.points.set(user._id, currentPoints - colorCost);

    // Mark color as purchased
    roomCosmetic.purchased.set(color, true);

    // Save changes
    await room.save();
    await roomCosmetic.save();

    return res.status(200).json({
      message: "Color purchased successfully",
      cosmetic: roomCosmetic,
      totalPoints: room.points.get(userId),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/selectColor", async (req, res) => {
  const { userId, roomId, index, color } = req.body;

  if (!userId || !roomId || index === undefined || !color) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Find the user and populate RoomCosmetics
    const user = await User.findById(userId).populate("roomCosmetics");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the correct RoomCosmetic by roomId
    const roomCosmetic = user.roomCosmetics.find(
      (rc) => rc.room.toString() === roomId
    );
    if (!roomCosmetic) {
      return res
        .status(404)
        .json({ error: "RoomCosmetic not found for this room" });
    }

    // Check if the color has been purchased
    if (color != "default" && !roomCosmetic.purchased.get(color)) {
      return res.status(400).json({ error: "Color not purchased yet" });
    }

    // Set the selected color at the given index
    roomCosmetic.selected[index] = color;
    await roomCosmetic.save();

    return res.status(200).json({ cosmetic: roomCosmetic });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/getCosmetic", async (req, res) => {
  try {
    const { userId, roomId } = req.query;

    if (!userId || !roomId) {
      return res.status(400).json({ error: "Missing userId or roomId" });
    }

    console.log("getting user");

    // Find the user and populate their roomCosmetics
    const user = await User.findOne({ userId: userId })
      .populate("roomCosmetics")
      .exec();

    console.log("user gotten");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the RoomCosmetic associated with the given roomId
    const cosmetic = user.roomCosmetics.find(
      (rc) => rc.room.toString() === roomId
    );

    if (!cosmetic) {
      return res
        .status(404)
        .json({ error: "No RoomCosmetic found for this room" });
    }

    // Optionally, populate fields inside the RoomCosmetic if needed
    const populatedCosmetic = await RoomCosmetic.findById(cosmetic._id).exec();

    return res.status(200).json({ cosmetic: populatedCosmetic });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/getUsers/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    // roomMembers is an array of strings that match the User model's userId field.
    const memberIds = room.roomMembers;
    // Query users by matching the userId field.
    const users = await User.find({ userId: { $in: memberIds } }).select(
      "username userId"
    );
    // Transform the output so that each user has _id equal to userId.
    const transformed = users.map((u) => ({
      _id: u.userId,
      username: u.username,
    }));
    res.json(transformed);
  } catch (error) {
    console.error("Error fetching room users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET points for a room
router.get("/points/:roomId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).select("points");
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ points: room.points });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//for the chores page, do not mess with!
router.get("/getMembers/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    // roomMembers is an array of strings that match the User model's userId field.
    const memberIds = room.roomMembers;
    // Query users by matching the userId field.
    const users = await User.find({ userId: { $in: memberIds } }).select(
      "username _id email"
    );
    // Transform the output so that each user has _id equal to userId.
    const transformed = users.map((u) => ({
      _id: u._id,
      username: u.username,
      email: u.email,
    }));
    res.json(transformed);
  } catch (error) {
    console.error("Error fetching room users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/leaveRoom", async (req, res) => {
  const { roomId, userId } = req.query;

  let room = await Room.findById(roomId);
  // Check if the room exists
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }
  let user = await User.findOne({ userId: userId });

  // Check if the user is in the room, leave the room if they are
  if (room.roomMembers.includes(userId)) {
    // Remove the room from the user's list of rooms
    user.rooms = user.rooms.filter((room) => room._id.toString() !== roomId);
    await user.save();
    // If the user is the last person in the room, delete the room
    if (room.roomMembers.length === 1) {
      await Room.deleteOne({ _id: roomId });
      console.log("Room deleted:", roomId);
    } else {
      // Otherwise, just remove the user from the room
      room.roomMembers = room.roomMembers.filter(
        (member) => member.toString() !== userId
      );
      await room.save();
      console.log("User removed from room:", userId);

      let roomMembers = [];
      for (let i of room.roomMembers) {
        if (i != user.userId) {
          let curr = await User.findOne({ userId: i });
          roomMembers.push(curr._id);
        }
      }

      // Notify all other members of the room
      const memberNotificationDesc =
        user.username + " has left the room: " + room.roomName + "!";
      const memeberNotification = new Notification({
        usersNotified: roomMembers,
        description: memberNotificationDesc,
        pageID: `/room/${room._id}`,
        origin: user._id,
      });

      await memeberNotification.save();
      await memeberNotification.propagateNotification();
    }
    return res
      .status(200)
      .json({
        message: "User successfully left!",
        userData: user,
        roomData: room,
      });
  } else {
    return res
      .status(404)
      .json({ message: "User is not a member of this room" });
  }
});

router.post("/updateRoomSettings", async (req, res) => {
  const { roomId, settings, roomName } = req.body;
  try {
    console.log(roomId);
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    room.settings = settings;
    room.roomName = roomName;
    await room.save();
    console.log("Room settings updated:", room);
    res
      .status(200)
      .json({ message: "Room settings updated successfully", roomData: room });
  } catch (error) {
    console.error("Error updating room settings:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
