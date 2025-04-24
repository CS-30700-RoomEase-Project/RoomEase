// src/components/Pages/RoomState/RoomState.js
import React, { useEffect, useState, useCallback } from "react";
import styles from "./RoomState.module.css";

export default function RoomState() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [future, setFuture] = useState([]);
  const [request, setRequest] = useState("");
  const [level, setLevel] = useState("Low");
  const [custom, setCustom] = useState("");
  const [color, setColor] = useState("#ffffff");

  const userId = localStorage.getItem("userId");

  // 1️⃣ your “reload everything” helper
  const loadQueue = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(
      `http://localhost:5001/api/roomstate/queue/${userId}`
    );
    if (!res.ok) return;
    const { history, current, future } = await res.json();
    setHistory(history || []);
    setCurrent(current || null);
    setFuture(future || []);
  }, [userId]);

  // 2️⃣ on-mount fetch
  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // 3️⃣ shift pointer
  const shiftPointer = async (direction) => {
    await fetch("http://localhost:5001/api/roomstate/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, direction }),
    });
    await loadQueue();
  };

  // 4️⃣ clear current = shift right
  const handleClear = () => {
    shiftPointer("right");
  };

  // 5️⃣ add a new state
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!request.trim()) return;
    const final = custom || level;
    await fetch("http://localhost:5001/api/roomstate/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, request, level: final, color }),
    });
    setRequest("");
    setCustom("");
    // now reload
    await loadQueue();
  };

  // pick our three to display
  const pastItem =
    history.length > 0
      ? history[history.length - 1]
      : { request: "—", level: "—", color: "#444" };
  const currItem =
    current || { request: "—", level: "—", color: "#888" };
  const futItem =
    future.length > 0
      ? future[0]
      : { request: "—", level: "—", color: "#444" };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Room Timeline</h1>

      <div className={styles.timelineContainer}>
        <div
          className={styles.stateBox}
          style={{ backgroundColor: pastItem.color }}
        >
          <h4>Past</h4>
          <p><strong>Req:</strong> {pastItem.request}</p>
          <p><strong>Lvl:</strong> {pastItem.level}</p>
        </div>

        <span
          className={styles.arrow}
          onClick={() => shiftPointer("left")}
        >
          ←
        </span>

        <div
          className={styles.stateBox}
          style={{ backgroundColor: currItem.color }}
        >
          <h4>Current</h4>
          <p><strong>Req:</strong> {currItem.request}</p>
          <p><strong>Lvl:</strong> {currItem.level}</p>
          <button
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear Current
          </button>
        </div>

        <span
          className={styles.arrow}
          onClick={() => shiftPointer("right")}
        >
          →
        </span>

        <div
          className={styles.stateBox}
          style={{ backgroundColor: futItem.color }}
        >
          <h4>Future</h4>
          <p><strong>Req:</strong> {futItem.request}</p>
          <p><strong>Lvl:</strong> {futItem.level}</p>
        </div>
      </div>

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
            onChange={(e) => {
              setLevel(e.target.value);
              setCustom("");
            }}
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
          <div
            className={styles.colorBox}
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={styles.colorInput}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit New
        </button>
      </form>
    </div>
  );
}
