// frontend/src/components/Pages/SubmitDispute/SubmitDispute.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./SubmitDispute.module.css";

export default function SubmitDispute() {
  const { roomId } = useParams();
  const [current, setCurrent]         = useState(null);
  const [next, setNext]               = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // 1️⃣ load current + next
  const loadQueue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/disputes/queue/${roomId}`);
      if (!res.ok) throw new Error(res.statusText);
      const { current, next } = await res.json();
      setCurrent(current);
      setNext(next);
    } catch (err) {
      console.error(err);
      setError("Could not load disputes");
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // 2️⃣ advance to next dispute
  const advance = async () => {
    await fetch(process.env.REACT_APP_API_URL + "/api/disputes/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, direction: "right" }),
    });
    await loadQueue();
  };

  // 3️⃣ clear current → remove from queue
  const handleClear = async () => {
    await fetch(process.env.REACT_APP_API_URL + "/api/disputes/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });
    await loadQueue();
  };

  // 4️⃣ submit new dispute
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    await fetch(process.env.REACT_APP_API_URL + "/api/disputes/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, description: description.trim() }),
    });
    setDescription("");
    await loadQueue();
  };

  if (loading) return <div className={styles.container}>Loading…</div>;
  if (error)   return <div className={styles.container}>{error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dispute Queue</h1>

      <div className={styles.queue}>
        {/* Current box */}
        <div className={styles.disputeBox}>
          <h2 className={styles.sectionTitle}>Current</h2>
          <p className={styles.disputeTitle}>
            {current?.description || "No current dispute"}
          </p>
          <button onClick={handleClear} className={styles.clearButton}>
            Clear Current
          </button>
        </div>

        {/* Arrow to advance */}
        <span className={styles.arrow} onClick={advance}>
          ↑
        </span>

        {/* Next box */}
        <div className={styles.disputeBox}>
          <h2 className={styles.sectionTitle}>Next</h2>
          <p className={styles.disputeTitle}>
            {next?.description || "No next dispute"}
          </p>
        </div>
      </div>

      {/* Submission form */}
      <form onSubmit={handleAdd} className={styles.form}>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your dispute..."
          required
        />
        <button type="submit" className={styles.submitButton}>
          Submit New Dispute
        </button>
      </form>
    </div>
  );
}
