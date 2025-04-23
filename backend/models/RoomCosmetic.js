const mongoose = require("mongoose");

const defaultColors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "orange",
  "silver",
  "gold",
];

const decorations = ["Puppy", "Fridge Letters"];

const activeDecorations = { Puppy: false, "Fridge Letters": false };
const purchasedDecorations = {};
const decorationCost = {};
const baseDecorationCost = 200;
const puppyCost = 800;

decorations.forEach((decoration) => {
  purchasedDecorations[decoration] = false;
  if (decoration == "Puppy") {
    decorationCost[decoration] = puppyCost;
  } else {
    decorationCost[decoration] = baseDecorationCost;
  }
});

const defaultColorsPurchased = {};
const defaultColorCost = {};

const baseCost = 100;
const silverCost = 300;
const goldCost = 500;

defaultColors.forEach((color) => {
  defaultColorsPurchased[color] = false;
  if (color === "silver") {
    defaultColorCost[color] = silverCost;
  } else if (color === "gold") {
    defaultColorCost[color] = goldCost;
  } else {
    defaultColorCost[color] = baseCost;
  }
});

const RoomCosmeticSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },

    colorsPurchased: {
      type: Map,
      of: Boolean,
      default: defaultColorsPurchased,
    },

    colorCost: {
      type: Map,
      of: Number,
      default: defaultColorCost,
    },

    selected: {
      type: [{ type: String }],
      default: [
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
        "default",
      ],
    },

    activeDecorations: {
      type: Map,
      of: Boolean,
      default: activeDecorations,
    },

    decorationCost: {
      type: Map,
      of: Number,
      default: decorationCost,
    },

    decorationsPurchased: {
      type: Map,
      of: Boolean,
      default: purchasedDecorations,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoomCosmetic", RoomCosmeticSchema);
