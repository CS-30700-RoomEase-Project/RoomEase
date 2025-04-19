import React, { useState } from "react";
import "./CosmeticStorePopup.css"; // for styling if needed

const CosmeticStorePopup = ({
  isOpen,
  onClose,
  cosmetics,
  totalPoints,
  onPurchase,
  onSelect,
}) => {
  const availableColors = Object.keys(cosmetics.cost || {});
  const elements = [
    "fridge",
    "table",
    "computer",
    "trash",
    "board",
    "clock",
    "gavel",
    "background",
  ];

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Cosmetic Store</h2>
        <p>Your Points: {totalPoints}</p>

        <div className="color-store">
          {availableColors.map((color) => (
            <div key={color} className="color-block">
              <div
                className="color-preview"
                style={{ backgroundColor: color }}
              ></div>
              <p>{color}</p>
              <p>Cost: {cosmetics.cost[color]}</p>
              {cosmetics.purchased[color] ? (
                <p className="owned">Owned</p>
              ) : (
                <button
                  onClick={() => onPurchase(color)}
                  disabled={totalPoints < cosmetics.cost[color]}
                >
                  Unlock
                </button>
              )}
            </div>
          ))}
        </div>

        <h3>Select a color for each item:</h3>
        <div className="selection-grid">
          {elements.map((item, index) => (
            <div key={index} className="selector">
              <label>{item}</label>
              <select
                value={
                  (cosmetics.selected && cosmetics.selected[index]) || "default"
                }
                onChange={(e) => onSelect(index, e.target.value)}
              >
                <option key="default" value="default">
                  default
                </option>
                {availableColors
                  .filter((c) => cosmetics.purchased[c])
                  .map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>

        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CosmeticStorePopup;
