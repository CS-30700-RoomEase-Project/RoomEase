"use client"
import { useRef } from "react"
import "./gavel.css"

function Gavel({ onClick, enabled }) {
  const gavelRef = useRef(null)

  const handleHover = () => {
    if (!gavelRef.current) return
    const el = gavelRef.current

    el.classList.add("swing")

    el.addEventListener("animationend", () => {
      el.classList.remove("swing")
    }, { once: true })
  }

  return (
    <div
      ref={gavelRef}
      className="gavel-container"
      onClick={onClick}
      onMouseEnter={handleHover}
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
