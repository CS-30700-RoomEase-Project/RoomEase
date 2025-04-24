// src/components/Pages/RoomState/RoomState.js
import React, { useEffect, useState, useCallback } from "react";
import styles from "./RoomState.module.css";

// helper to format milliseconds → "SS"
function formatRemaining(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function RoomState() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [future, setFuture] = useState([]);
  const [request, setRequest] = useState("");
  const [level, setLevel] = useState("Low");
  const [custom, setCustom] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [now, setNow] = useState(Date.now());

  const userId = localStorage.getItem("userId");

  // 1️⃣ load the 3‐slot window
  const loadQueue = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(`http://localhost:5001/api/roomstate/queue/${userId}`);
    if (!res.ok) return;
    const { history, current, future } = await res.json();
    setHistory(history || []);
    setCurrent(current || null);
    setFuture(future || []);
  }, [userId]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // live clock tick for timer display
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2️⃣ manual shift
  const shiftPointer = async (direction) => {
    await fetch("http://localhost:5001/api/roomstate/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, direction }),
    });
    await loadQueue();
  };

  // 3️⃣ clear current → next
  const handleClear = () => shiftPointer("right");

  // 4️⃣ auto‐advance if current has expired (1 hr TTL)
  useEffect(() => {
    if (!current || current.request === "Available") return;
    const elapsed = now - new Date(current.timestamp);
    if (elapsed >= 3_600_000) {
      handleClear();
    }
  }, [now, current]);

  // 5️⃣ submit a new future state
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!request.trim()) return;
    const finalLevel = custom || level;
    await fetch("http://localhost:5001/api/roomstate/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, request, level: finalLevel, color }),
    });
    setRequest("");
    setCustom("");
    await loadQueue();
  };

  // pick three items or defaults
  const pastItem =
    history.length > 0
      ? history[history.length - 1]
      : { request: "Available", level: "—", color: "#ccc", timestamp: now };
  const currItem =
    current || { request: "Available", level: "—", color: "#aaa", timestamp: now };
  const futItem =
    future.length > 0
      ? future[0]
      : { request: "Available", level: "—", color: "#ccc", timestamp: now };

  // remaining seconds for current
  const remainingSec = (item) =>
    formatRemaining(3_600_000 - (now - new Date(item.timestamp)));

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Room Timeline</h1>

      <div className={styles.timelineContainer}>
        {/* Past */}
        <div className={styles.stateBox} style={{ backgroundColor: pastItem.color }}>
          <h4>Past</h4>
          <p><strong>Request:</strong> {pastItem.request}</p>
          <p><strong>Level:</strong> {pastItem.level}</p>
        </div>

        <span className={styles.arrow} onClick={() => shiftPointer("left")}>←</span>

        {/* Current */}
        <div className={`${styles.stateBox} ${styles.currentBox}`} style={{ backgroundColor: currItem.color }}>
          <h4>Current</h4>
          <p><strong>Request:</strong> {currItem.request}</p>
          <p><strong>Level:</strong> {currItem.level}</p>
          <button onClick={handleClear} className={styles.clearButton}>Clear Current</button>
          {currItem.request !== "Available" && (
            <div className={styles.timer}>{remainingSec(currItem)}s</div>
          )}
        </div>

        <span className={styles.arrow} onClick={() => shiftPointer("right")}>→</span>

        {/* Future */}
        <div className={styles.stateBox} style={{ backgroundColor: futItem.color }}>
          <h4>Future</h4>
          <p><strong>Request:</strong> {futItem.request}</p>
          <p><strong>Level:</strong> {futItem.level}</p>
        </div>
      </div>

      {/* submission form */}
      <form onSubmit={handleAdd} className={styles.form}>
        <div className={styles.field}>
          <label>Enter Request:</label>
          <input
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Level:</label>
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); setCustom(""); }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Custom</option>
          </select>
        </div>

        {level === "Custom" && (
          <div className={styles.field}>
            <label>Custom Level:</label>
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label>Select Color:</label>
          <div className={styles.colorBox} style={{ backgroundColor: color }} />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={styles.colorInput}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Submit New</button>
      </form>
    </div>
  );
}
