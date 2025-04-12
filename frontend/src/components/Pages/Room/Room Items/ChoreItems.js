"use client"
import Broom from "./Broom"
import "./chore-items.css"
import TrashCan from "./TrashCan"

const ChoreItems = ({ onClick, enabled }) => {
  return (
    <div
      className="chore-items-container"
      onClick={onClick}
      title={enabled ? "Chores" : ""}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none",
      }}
    >
      <TrashCan />
      <Broom />
    </div>
  )
}

export default ChoreItems
