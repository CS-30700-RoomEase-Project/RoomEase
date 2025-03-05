const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    description: String,
    pageID: String,
    usersNotified: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notificationType: String,
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

NotificationSchema.methods.propagateNotification = async function () {
    try {
        // Dynamically import the User model only when needed
        const User = require('../models/User');
        // Iterate through the usersNotified array and update their notifications field
        await User.updateMany(
            { _id: { $in: this.usersNotified } },
            { $push: { notifications: this._id } }
        );
        return "worked";
    } catch (error) {
        console.error("Error propagating notification:", error);
        return "error";
    }
};

module.exports = mongoose.model('Notification', NotificationSchema);
