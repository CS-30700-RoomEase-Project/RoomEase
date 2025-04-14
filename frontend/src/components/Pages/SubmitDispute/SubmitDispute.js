import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SubmitDispute.module.css';

const defaultDispute = "No active disputes";
const defaultNextDispute = "No upcoming disputes";

export default function SubmitDispute() {
  const { roomId } = useParams();
  const [currentDispute, setCurrentDispute] = useState("");
  const [nextDispute, setNextDispute] = useState("");
  const [disputeInput, setDisputeInput] = useState("");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/disputes/${roomId}`);
        const data = await res.json();

        setCurrentDispute(data.currentDispute || defaultDispute);
        setNextDispute(data.nextDispute || defaultNextDispute);
      } catch (err) {
        console.error("Failed to fetch disputes:", err);
        setCurrentDispute(defaultDispute);
        setNextDispute(defaultNextDispute);
      }
    };

    fetchDisputes();
  }, [roomId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle dispute submission logic here
    console.log("Dispute Submitted:", disputeInput);
    setDisputeInput("");
  };

  return (
    <div className={styles.flowContainer}>
      <div className={styles.box}>
        <h3>Enter Details of Dispute</h3>
        <textarea
          className={styles.textarea}
          placeholder="Enter your dispute..."
          value={disputeInput}
          onChange={(e) => setDisputeInput(e.target.value)}
        />
      </div>

      <div className={styles.arrow}>↑</div>

      <div className={styles.box}>
        <h3>Submit a Dispute</h3>
        <button onClick={handleSubmit} className={styles.button}>
          Submit Dispute
        </button>
      </div>

      <div className={styles.arrow}>↑</div>

      <div className={styles.box}>
        <h3>Next Dispute</h3>
        <p>{nextDispute}</p>
      </div>

      <div className={styles.arrow}>↑</div>

      <div className={styles.box}>
        <h3>Current Dispute</h3>
        <p>{currentDispute}</p>
      </div>
    </div>
  );
}
