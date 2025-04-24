import React, { useState } from "react";
import "./CosmeticStorePopup.css"; // for styling if needed

const CosmeticStorePopup = ({
  isOpen,
  onClose,
  cosmetics,
  totalPoints,
  onPurchase,
  onSelect,
  onPurchaseDecoration, // new prop for purchasing decorations
  onToggleDecoration, // now expects (decoration, newState)
}) => {
  const [activeTab, setActiveTab] = useState("colors"); // added for tabs
  const availableColors = Object.keys(cosmetics.colorCost || {});
  const availableDecorations = Object.keys(cosmetics.decorationCost || {});

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

  // Helper to get active state of a decoration based on assumed order:
  const getActiveState = (decoration) => {
    if (!cosmetics.activeDecorations) return false;
    if (decoration.toLowerCase() === "puppy")
      return cosmetics.activeDecorations[0];
    if (decoration.toLowerCase() === "fridge letters")
      return cosmetics.activeDecorations[1];
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="cosmetic-popup">
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Cosmetic Store</h2>
          <p>Your Points: {totalPoints}</p>
          {/* Tab selectors */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab("colors")}
              className={activeTab === "colors" ? "active" : ""}
            >
              Colors
            </button>
            <button
              onClick={() => setActiveTab("decorations")}
              className={activeTab === "decorations" ? "active" : ""}
            >
              Decorations
            </button>
          </div>
          {/* Tab content */}
          {activeTab === "colors" && (
            <>
              <h3>Colors</h3>
              <div
                className="store"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "10px",
                }}
              >
                {availableColors.map((color) => (
                  <div key={color} className="color-block">
                    <div
                      className="color-preview"
                      style={{ backgroundColor: color }}
                    ></div>
                    <p>{color}</p>
                    <p>Cost: {cosmetics.colorCost[color]}</p>
                    {cosmetics.colorsPurchased[color] ? (
                      <p className="owned">Owned</p>
                    ) : (
                      <button
                        onClick={() => onPurchase(color)}
                        disabled={totalPoints < cosmetics.colorCost[color]}
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
                      value={cosmetics.selected[index]}
                      onChange={(e) => onSelect(index, e.target.value)}
                    >
                      <option key={"default"} value={"default"}>
                        default
                      </option>
                      {availableColors
                        .filter((c) => cosmetics.colorsPurchased[c])
                        .map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === "decorations" && (
            <>
              <h3>Decorations</h3>
              <div
                className="store"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "10px",
                }}
              >
                {availableDecorations.map((decoration) => {
                  const isPurchased =
                    cosmetics.decorationsPurchased &&
                    cosmetics.decorationsPurchased[decoration];
                  const active = cosmetics.activeDecorations[decoration];
                  return (
                    <div key={decoration} className="decoration-item">
                      <p>{decoration}</p>
                      <p>Cost: {cosmetics.decorationCost[decoration]}</p>
                      {!isPurchased ? (
                        <button
                          onClick={() => onPurchaseDecoration(decoration)}
                          disabled={
                            totalPoints < cosmetics.decorationCost[decoration]
                          }
                        >
                          Unlock
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onToggleDecoration(decoration, !active)
                          }
                        >
                          {active ? "Disable" : "Enable"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          <button className="close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CosmeticStorePopup;
