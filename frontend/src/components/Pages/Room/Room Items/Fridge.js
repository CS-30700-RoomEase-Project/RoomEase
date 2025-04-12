"use client"

import { useState } from "react"
import GroceryPopUp from "../../GroceryPage/GroceryPopUp"
import "./fridge.css"

function Fridge({ room, enabled }) {
  const [isPopUpOpen, setPopUpOpen] = useState(false)

  const handleClick = () => {
    if (enabled) {
      setPopUpOpen(true)
    }
  }

  return (
    <div
      className="fridge-container"
      onClick={handleClick}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none",
      }}
      title={enabled ? "Grocery List" : ""}
    >
      <div className="fridge-body">
        <div className="freezer-door">
          <div className="freezer-handle"></div>
          <div className="freezer-light"></div>
        </div>
        <div className="fridge-door">
          <div className="fridge-handle"></div>
          <div className="fridge-light"></div>
          <div className="water-dispenser">
            <div className="dispenser-panel"></div>
            <div className="dispenser-recess"></div>
          </div>
        </div>
      </div>
      {isPopUpOpen && <GroceryPopUp room={room} isOpen={isPopUpOpen} onClose={() => setPopUpOpen(false)} />}
    </div>
  )
}

export default Fridge
