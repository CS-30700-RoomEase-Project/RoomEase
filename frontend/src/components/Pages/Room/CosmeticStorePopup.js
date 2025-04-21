import React, { useState } from "react";
import "./CosmeticStorePopup.css"; // for styling if needed

const CosmeticStorePopup = ({
  isOpen,
  onClose,
  cosmetics,
  totalPoints,
  onPurchase,
  onSelect,
  onToggleDecoration, // added new prop for toggling decorations
}) => {
  const [activeTab, setActiveTab] = useState("colors"); // added for tabs
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
            </>
          )}
          {activeTab === "decorations" && (
            <>
              <h3>Decorations</h3>
              <div className="decoration-store">
                {Object.keys(cosmetics.decorations || {}).length > 0 ? (
                  Object.keys(cosmetics.decorations).map((decoration) => (
                    <div key={decoration} className="decoration-item">
                      <span>{decoration}</span>
                      {cosmetics.decorations[decoration].purchased ? (
                        <label>
                          <input
                            type="checkbox"
                            checked={cosmetics.decorations[decoration].enabled}
                            onChange={(e) =>
                              onToggleDecoration(decoration, e.target.checked)
                            }
                          />
                          Enabled
                        </label>
                      ) : (
                        <p className="not-owned">Not Owned</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No decorations available.</p>
                )}
              </div>
            </>
          )}
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
    </div>
  );
};

export default CosmeticStorePopup;
