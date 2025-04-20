const mongoose = require('mongoose');

const defaultColors = ["red", "green", "blue", "yellow", "purple", "orange", "silver", "gold"];

const defaultPurchased = {};
const defaultCost = {};

const baseCost = 100;
const silverCost = 300;
const goldCost = 500;

defaultColors.forEach(color => {
    defaultPurchased[color] = false;
    if (color === "silver") {
        defaultCost[color] = silverCost;
    } else if (color === "gold") {
        defaultCost[color] = goldCost;
    } else {
        defaultCost[color] = baseCost;
    }
});

const RoomCosmeticSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },

    purchased: {
        type: Map,
        of: Boolean,
        default: defaultPurchased
    },

    cost: {
        type: Map,
        of: Number,
        default: defaultCost
    },

    selected: {
        type:[{type:String}],
        default:["default", "default","default","default","default","default","default","default"]
    }

}, { timestamps: true });

module.exports = mongoose.model('RoomCosmetic', RoomCosmeticSchema);
