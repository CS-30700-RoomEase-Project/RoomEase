// frontend/src/components/Pages/Disputes/Disputes.js

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styles from "./Disputes.module.css";
import VotingIcon from "./VotingIcon.png";

// format seconds → "SS"
function padSec(sec) {
  return String(Math.max(0, sec)).padStart(2, "0");
}

export default function Disputes() {
  const { roomId } = useParams();
  const [voters, setVoters] = useState([]);
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState(null);

  const [startTime, setStartTime] = useState(null); // when this dispute’s timer began
  const [now, setNow] = useState(Date.now());

  // 1️⃣ load dispute + members, reset local timer & vote
  const loadQueue = useCallback(async () => {
    try {
      const res = await fetch(`/api/disputes/queue/${roomId}`);
      if (!res.ok) throw new Error(res.statusText);
      const { current: cd, roomMembers } = await res.json();
      setCurrent(cd);
      setVoters(roomMembers || []);
      setSelected(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error("Failed loading dispute queue", err);
    }
  }, [roomId]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // 2️⃣ live clock tick
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, []);

  // 3️⃣ auto‐clear when 30 s elapsed
  useEffect(() => {
    if (startTime === null || !current) return;
    const elapsed = now - startTime;
    if (elapsed >= 30_000) {
      // clear dispute on server, then reload (which restarts timer)
      fetch("/api/disputes/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      }).then(() => loadQueue());
    }
  }, [now, startTime, current, roomId, loadQueue]);

  // 4️⃣ voting
  const handleVote = async (voteFor) => {
    setSelected(voteFor);
    const voterId = localStorage.getItem("userId");
    await fetch("/api/disputes/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, voterId, voteFor }),
    });
  };

  // compute remaining seconds
  const remainingSec =
    startTime !== null
      ? Math.ceil((30_000 - (now - startTime)) / 1000)
      : 0;

  return (
    <div className={styles.container}>
      <h1>Dispute Poll</h1>
      <p className={styles.question}>
        {current?.description || "No active dispute"}
      </p>

      <div className={styles.voteContainer}>
        {voters.map((id, idx) => {
          const label = `User ${idx + 1}: ${id.slice(-4)}`;
          return (
            <div key={id} className={styles.voteOption}>
              <button
                onClick={() => handleVote(id)}
                className={styles.voteButton}
              >
                {label}
              </button>
              {selected === id && (
                <img
                  src={VotingIcon}
                  alt="voted"
                  className={styles.votingIcon}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* always show countdown when there's an active dispute */}
      {current && (
        <div className={styles.timer}>
          {padSec(remainingSec)}s
        </div>
      )}
    </div>
  );
}
