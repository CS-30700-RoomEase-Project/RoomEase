const express = require('express');
const sharp = require('sharp');  // NEW: import sharp for image processing
const User = require('../models/User');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

const router = express.Router();

const multer = require('multer');
// Configure multer to store image in memory (for storing as Buffer in MongoDB)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/createRoom', async (req, res) => {
    const { userId, roomName, groupPic, settings } = req.body;

    console.log("Received data:", { userId, roomName, groupPic, settings}); // Add this log for debugging

    try {
        let user = await User
            .findOne({ userId })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newRoom = new Room({ roomName, groupPic, settings });
        newRoom.roomId = newRoom._id;
        await newRoom.save();
        console.log("Room saved to MongoDB:", newRoom);

        // Add the room to the user's list of rooms
        user.rooms.push(newRoom);
        await user.save();

        // Add the user to list of room members

        newRoom.roomMembers.push(userId);
        await newRoom.save();

        res.status(200).json({ message: "Room created successfully", userData: user, room: newRoom });
    }
    catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.post('/uploadRoomImage/:roomId', upload.single('roomImage'), async (req, res) => {
    try {
        const { roomId } = req.params;
        const file = req.file;
        console.log("File received:", file); // Debugging line
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        const resizedBuffer = await sharp(file.buffer)
          .resize(350, 100)
          .toBuffer();

        room.roomImage = resizedBuffer;
        await room.save();

        res.status(200).json({ message: 'Room image updated successfully', roomId: room._id });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('/roomImage/:roomId', async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
  
      if (!room || !room.roomImage) {
        return res.status(404).json({ message: 'Room or image not found' });
      }
  
      res.set('Content-Type', 'image/jpeg'); // or 'image/png' based on what you expect
      res.send(room.roomImage);
    } catch (error) {
      console.error('Error fetching room image:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  });

  
router.get('/getRoom', async( req, res) => {
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
            return res.status(200).json({ message: "User is in the room", room: room });
        } else {
            console.log(room.roomMembers);
            return res.status(404).json({ message: "Access Denied: User is not a member of this room" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/getUsers/:roomId', async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      // roomMembers is an array of strings that match the User model's userId field.
      const memberIds = room.roomMembers;
      // Query users by matching the userId field.
      const users = await User.find({ userId: { $in: memberIds } }).select('username userId');
      // Transform the output so that each user has _id equal to userId.
      const transformed = users.map(u => ({
        _id: u.userId,
        username: u.username
      }));
      res.json(transformed);
    } catch (error) {
      console.error("Error fetching room users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

// GET points for a room
router.get('/points/:roomId', async (req, res) => {
    try {
      const room = await Room.findById(req.params.roomId).select('points');
      if (!room) return res.status(404).json({ error: 'Room not found' });
  
      res.json({ points: room.points });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

//for the chores page, do not mess with!
router.get('/getMembers/:roomId', async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }
      // roomMembers is an array of strings that match the User model's userId field.
      const memberIds = room.roomMembers;
      // Query users by matching the userId field.
      const users = await User.find({ userId: { $in: memberIds } }).select('username _id email');
      // Transform the output so that each user has _id equal to userId.
      const transformed = users.map(u => ({
        _id: u._id,
        username: u.username,
        email: u.email
      }));
      res.json(transformed);
    } catch (error) {
      console.error("Error fetching room users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});
  
router.get('/leaveRoom', async (req, res) => {
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
        user.rooms = user.rooms.filter(room => room._id.toString() !== roomId);
        await user.save();
        // If the user is the last person in the room, delete the room
        if (room.roomMembers.length === 1) {
            await Room.deleteOne({ _id: roomId });
            console.log("Room deleted:", roomId);
        } else { // Otherwise, just remove the user from the room
            room.roomMembers = room.roomMembers.filter(member => member.toString() !== userId);
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
            const memberNotificationDesc = user.username + " has left the room: " + room.roomName + "!";
            const memeberNotification = new Notification({
                usersNotified: roomMembers,
                description: memberNotificationDesc,
                pageID: `/room/${room._id}`,
                origin: user._id
            })
            
            await memeberNotification.save();
            await memeberNotification.propagateNotification();
        }
        return res.status(200).json({ message: "User successfully left!", userData: user, roomData: room });
    } else {
        return res.status(404).json({ message: "User is not a member of this room" });
    }
});

router.post('/updateRoomSettings', async (req, res) => {
    const { roomId, settings, roomName } = req.body;
    try {
        console.log(roomId);
        const room = await Room.findOne({_id: roomId});
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }   
        room.settings = settings;
        room.roomName = roomName;
        await room.save();
        console.log("Room settings updated:", room);
        res.status(200).json({ message: "Room settings updated successfully", roomData: room });
    } catch (error) {
        console.error("Error updating room settings:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
  

module.exports = router;