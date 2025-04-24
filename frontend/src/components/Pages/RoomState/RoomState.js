import React, { useEffect, useState } from "react"
import styles from "./RoomState.module.css"

export default function RoomState() {
  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState(null)
  const [future, setFuture]   = useState([])
  const [idx, setIdx]         = useState(0)       // current pointer in timeline
  const [request, setRequest] = useState("")
  const [level, setLevel]     = useState("Low")
  const [custom, setCustom]   = useState("")
  const [color, setColor]     = useState("#FFFFFF")

  // fetch your queued/past states
  useEffect(() => {
    async function load() {
      try {
        const userId = localStorage.getItem("userId")
        const res = await fetch(
          `http://localhost:5001/api/roomstate/getRoomStateQueue/${userId}`
        )
        if (!res.ok) throw new Error("Fetch failed")
        const { history, current, future } = await res.json()
        setHistory(history || [])
        setCurrent(current || null)
        setFuture(future || [])
        // start index at the “current” position
        setIdx((history || []).length)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  // build one unified timeline array
  const timeline = [
    ...history,
    current ? [current.request, current.level, current.color] : null,
    ...future
  ].filter(Boolean)

  const atPast   = idx > 0
  const atFuture = idx < timeline.length - 1

  const step = (dir) => {
    setIdx(i => Math.min(Math.max(i + dir, 0), timeline.length - 1))
  }

  const handleClear = () => {
    // maybe POST clear on backend...
    setHistory(h => [...h, timeline[idx]])
    setCurrent(null)
    setIdx(history.length) 
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!request.trim()) return
    const final = custom || level
    const userId = localStorage.getItem("userId")
    try {
      const res = await fetch(
        "http://localhost:5001/api/roomstate/addRoomState", {
          method: "POST",
          headers: { "Content-Type":"application/json" },
          body: JSON.stringify({ request, level: final, color, userId })
        }
      )
      if (!res.ok) throw new Error("Add failed")
      // push old current to past, make new current, shift future
      setHistory(h => current ? [...h, { request: timeline[idx][0], level: timeline[idx][1], color: timeline[idx][2] }] : h)
      setCurrent({ request, level: final, color })
      setFuture(f => f.slice(1))
      setIdx(history.length)   // point at new current
      setRequest(""); setCustom("")
      alert("Room state updated!")
    } catch (e) {
      console.error(e)
      alert("Failed to add")
    }
  }

  // unpack the one state we're looking at
  const [req, lvl, col] = timeline[idx] || ["No State","N/A","#FFFFFF"]

  return (
    <div className={styles.container}>
      <h1>Room State Timeline</h1>

      {/* ——— horizontal sidebar / timeline nav ——— */}
      <div className={styles.sidebar}>
        <button
          className={styles.nav}
          onClick={()=>step(-1)}
          disabled={!atPast}
        >‹</button>

        <div
          className={styles.stateBox}
          style={{ backgroundColor: col }}
        >
          <p><strong>Request:</strong> {req}</p>
          <p><strong>Level:</strong> {lvl}</p>
        </div>

        <button
          className={styles.nav}
          onClick={()=>step(+1)}
          disabled={!atFuture}
        >›</button>
      </div>

      {/* ——— action form ——— */}
      <form onSubmit={handleAdd} className={styles.form}>
        <div className={styles.field}>
          <label>Enter Request:</label>
          <input
            value={request}
            onChange={e => setRequest(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Level:</label>
          <select
            value={level}
            onChange={e => { setLevel(e.target.value); setCustom("") }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Custom</option>
          </select>
        </div>

        {level==="Custom" && (
          <div className={styles.field}>
            <label>Custom Level:</label>
            <input
              value={custom}
              onChange={e => setCustom(e.target.value)}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
          />
        </div>

        <div className={styles.buttons}>
          <button type="button" onClick={handleClear} disabled={!current}>
            Clear Current
          </button>
          <button type="submit">
            Submit New
          </button>
        </div>
      </form>
    </div>
  )
}
