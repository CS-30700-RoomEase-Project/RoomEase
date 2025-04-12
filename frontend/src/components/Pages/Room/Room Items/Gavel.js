"use client"
import "./gavel.css"

function Gavel({ onClick, enabled }) {
  return (
    <div
      className="gavel-container"
      onClick={onClick}
      title={enabled ? "Handle Disputes" : ""}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none",
      }}
    >
      <div className="gavel-head"></div>
      <div className="gavel-handle"></div>
    </div>
  )
}

export default Gavel
