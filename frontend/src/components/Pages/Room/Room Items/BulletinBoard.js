"use client"
import "./bulletin-board.css"

function BulletinBoard({ onClick, enabled }) {
  return (
    <div
      className="bulletin-board-container"
      onClick={onClick}
      title={enabled ? "Bulletin Board" : ""}
      style={{
        cursor: enabled ? "pointer" : "default",
        pointerEvents: enabled ? "auto" : "none",
      }}
    >
      <div className="bulletin-frame">
        <div className="bulletin-cork">
          <div className="bulletin-note yellow">
            <div className="note-lines"></div>
          </div>
          <div className="bulletin-note blue">
            <div className="note-lines"></div>
          </div>
          <div className="bulletin-note green">
            <div className="note-lines"></div>
          </div>
          <div className="bulletin-pin red"></div>
          <div className="bulletin-pin blue"></div>
          <div className="bulletin-pin green"></div>
          <div className="bulletin-pin yellow"></div>
        </div>
      </div>
    </div>
  )
}

export default BulletinBoard
