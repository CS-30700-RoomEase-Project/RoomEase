const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room');
const Invite = require('../models/Invite');
const Notification = require('../models/Notification');
const RoomCosmetic = require('../models/RoomCosmetic');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/sendInvite', async (req, res) => {
    const { senderId, recieverEmail, roomId } = req.body;

    console.log("Received data:", { senderId, recieverEmail, roomId}); // Add this log for debugging

    try {

        // Get all relevant data entries, return 404 errors if any one of the entries can't be found
        let sender = await User
            .findOne({ userId: senderId })
        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }
        console.log("Sender found"); 

        let reciever = await User
            .findOne({ email: recieverEmail })
        if (!reciever) {
            return res.status(404).json({ message: "Reciever not found"})
        }
        console.log("Reciever found"); 

        let room = await Room
            .findOne({ _id: roomId })
        if (!room) {
            return res.status(404).json({ message: "Room not found"});
        }
        console.log("Room found"); 

        // Check to see if the invite already exists
        if (await Invite.findOne({reciever: reciever.userId, room: room}) ) {
            return res.status(200).json({ message: "Invite already sent to this user!"})
        }


        // Create an invite entry and save to the database
        console.log("RECIEVER ID: ", reciever.userId);
        const invite = new Invite({ source: senderId, reciever: reciever.userId, room, roomName: room.roomName });
        await invite.save();
        console.log("Invite saved to database");

        // Add the invite to the reciever's and room's invite lists
        room.outGoingInvites.push(invite);
        await room.save();
        console.log("Invite recieved by room");

        reciever.invites.push(invite);
        await reciever.save();
        console.log("Invite recieved by reciever");

        console.log("Invite successfully sent!");

        // Notify the reciever of the sent invite
        const recieverNotificationDesc = sender.username + " sent you an invite to join " + room.roomName;
        const recieverNotification = new Notification({
            usersNotified: reciever._id,
            description: recieverNotificationDesc,
            pageID: `/Dashboard`,
            notificationType: "Invite",
            origin: sender._id
        });
    
        await recieverNotification.save();
        await recieverNotification.propagateNotification();

        // Room members to notify
        let roomMembers = [];
        for (let i of room.roomMembers) {
            if (i !== sender.userId) {
                let curr = await User.findOne({ userId: i });
                roomMembers.push(curr._id);
            }
        }

        // Notify all room members of the invite
        const memberNotificationDesc = sender.username + " sent " +reciever.username + " an invite to join " + room.roomName;
        const memeberNotification = new Notification({
            usersNotified: roomMembers,
            description: memberNotificationDesc,
            pageID: `/room/${roomId}/invite`,
            origin: sender._id
        })

        await memeberNotification.save();
        await memeberNotification.propagateNotification();


        // Notify the room members of the sent invite
        res.status(200).json({ message: "Invite successfully sent!"});
    } 
    catch (error) {
        console.error("Error sending invite:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

router.post('/acceptInvite', async( req, res) => {
    console.log("1");
    const { userId, inviteId } = req.body;
    try {
        // Find the user, invite, and the room 
        let user = await User.findOne({ userId: userId });
        let invite = await Invite.findOne({ _id: inviteId });
        let room = await Room.findOne({ _id: invite.room._id });

        // Check if the user exists
        if (!user) {
            if (invite) await Invite.deleteOne({_id: invite._id}); //  If invite exists, remove it
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found");

        if (!room) {
            // If the room does not exist remove the invite from the reciever's invites array and throw
            // an error.
            user.invites.pull(invite);
            await user.save();
            if (invite) await Invite.deleteOne({_id: invite._id}); // If invite exists, remove it
            return res.status(404).json({ message: "Room not found, removing invite"});
        }
        console.log("Room found");

        if (!invite) { // Check if the invite exists
            return res.status(404).json({ message: "Invite not found"});
        }
        console.log("Invite found");

        // Create and save the RoomCosmetic using schema defaults
        const newCosmetic = new RoomCosmetic({
            room: room._id,
        });
    
        await newCosmetic.save();
    
        // Associate cosmetic with user
        user.roomCosmetics.push(newCosmetic._id);

        // If no issues occur add the user and room to each other's room membership arrays and 
        // return the updated room and user data. Then remove the invite from all arrays and from
        // the collection as a whole
        user.rooms.push(room);        
        room.roomMembers.push(user.userId);

        console.log("Room membership arrays successfully updated")

        // Now delete all instances of an invite from the arrays and collections in the database
        const userArr = user.invites.filter(
            (inv) => inv._id.toString() !== invite._id.toString()
          );
        user.invites = userArr.length ? userArr : [];
        await user.save();
        
        const roomArr = room.outGoingInvites.filter(
            (inv) => inv._id.toString() !== invite._id.toString()
          );
        room.outGoingInvites = roomArr.length ? roomArr : [];
        await room.save();

        await Invite.deleteOne({ _id: invite._id });

        console.log("b");
        // Room members to notify
        let roomMembers = [];
        for (let i of room.roomMembers) {
            if (i != user.userId) {
                let curr = await User.findOne({ userId: i });
                roomMembers.push(curr._id);
            }
        }
        console.log("b2");
        // Notify all room members of the invite
        const memberNotificationDesc = user.username + " accepted their invite to join " + room.roomName + "!";
        const memeberNotification = new Notification({
            usersNotified: roomMembers,
            description: memberNotificationDesc,
            pageID: `/room/${room._id}`,
            origin: user._id
        })

        await memeberNotification.save();
        await memeberNotification.propagateNotification();

        console.log("Invite successfully accepted!");
        user = await User.findOne({ userId: userId });
        console.log(user);
        res.status(200).json({ message: "Invite successfully accepted!", room, user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.delete ('/deleteInvite', async( req, res ) => {
    try {
        const {inviteId, deleterId} = req.body;
        console.log("Data Recieved: ", inviteId, deleterId)

        // Try to find the user trying to delete the invite. If it doesn't exist, throw an error
        let deleter = await User.findOne({ userId: deleterId });
        if (!deleter) {
            return res.status(404).json({ message: "User not found" });
        }

        // Try to find the invite the user is trying to delete. If it doesn't exist, throw an error
        let invite = await Invite.findOne({ _id: inviteId });
        if (!invite) {
            console.log(inviteId);
            return res.status(404).json({ message: "Invite not found" });
        }
        console.log(invite);
        let room = await Room.findOne({ _id: invite.room }); // Get the room associated with the invite
        let reciever = await User.findOne({ userId: invite.reciever }); // Get the reciever associated with the invite
                                                                        // (In case the reciever isn't the same as the deleter)

        // Now delete all instances of an invite from the arrays and collections in the database
        const recieverArr = reciever.invites.filter(
            (inv) => inv._id.toString() !== inviteId.toString()
          );
        reciever.invites = recieverArr.length ? recieverArr : [];
        await reciever.save();

        const roomArr = room.outGoingInvites.filter(
            (inv) => inv._id.toString() !== inviteId.toString()
          );
        room.outGoingInvites = roomArr.length ? roomArr : [];
        await room.save();

        await Invite.deleteOne({_id: invite._id});


        // Now handle sending notifications based on if this was a declination/revoking of an invite
        if (reciever.userId === deleter.userId) { // Invite declined
            // Room members to notify
            let roomMembers = [];
            for (let i of room.roomMembers) {
                let curr = await User.findOne({ userId: i });
                roomMembers.push(curr._id);
            }

            // Notify all room members of the invite
            const memberNotificationDesc = deleter.username + " rejected their invitation to join " + room.roomName;
            const memeberNotification = new Notification({
                usersNotified: roomMembers,
                description: memberNotificationDesc,
                pageID: `/room/${room._id}/invite`,
                origin: deleter._id
            })

            await memeberNotification.save();
            await memeberNotification.propagateNotification();
        } else { // Invite revoked 
            const revokedNotifDesc = deleter.username + " revoked your invitation to join " + room.roomName;
            const revokedNotif = new Notification({
                usersNotified: reciever._id,
                description: revokedNotifDesc,
                pageID: `/Dashboard`,
                origin: deleter._id
            })

            await revokedNotif.save();
            await revokedNotif.propagateNotification();
        }

        console.log("Invite successfully deleted!");
        console.log(deleter);
        res.status(200).json({ message: "Invite successfully deleted!", room, reciever  });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error })
    } 
});

module.exports = router;