import "./RoomItems.css"
import React from 'react'

function Computer() {
  return (
    <div className="computer-container">
      <div className="monitor-frame">
        <div className="monitor-screen"></div>
      </div>
      <div className="computer-stand"></div>
      <div className="computer-base"></div>
    </div>
  )
}

export default Computer