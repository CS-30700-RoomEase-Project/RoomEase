"use client"
import React from "react"
import "./trash-can.css"

const TrashCan = ({ onClick }) => {
  return (
    <div className="trash-can-container" onClick={onClick}>
      <div className="trash-can-lid">
        <div className="trash-can-lid-handle"></div>
      </div>
      <div className="trash-can-body">
        <div className="trash-can-shine"></div>
        <div className="trash-can-shadow"></div>
      </div>
    </div>
  )
}

export default TrashCan
