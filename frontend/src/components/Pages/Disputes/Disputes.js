import React, { useState, useEffect } from "react";
import styles from "./Disputes.module.css";

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [customSeverity, setCustomSeverity] = useState("");

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/disputes/getDisputes");
      const data = await response.json();
      if (response.ok) {
        setDisputes(data);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
    }
  };

  const handleVote = async (id, type) => {
    try {
      const response = await fetch(`http://localhost:5001/api/disputes/vote/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voteType: type }),
      });

      if (response.ok) {
        fetchDisputes(); // Refresh disputes after voting
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error voting on dispute:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      alert("Description cannot be empty.");
      return;
    }

    const finalSeverity = customSeverity ? customSeverity : severity;
    const userId = localStorage.getItem("userId"); // Replace with actual user ID

    try {
      const response = await fetch("http://localhost:5001/api/disputes/addDispute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          severity: finalSeverity,
          userId,
        }),
      });

      if (response.ok) {
        setDescription("");
        setCustomSeverity("");
        fetchDisputes();
        alert("Dispute reported successfully!");
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error reporting dispute:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Dispute Poll</h1>

      {/* Dispute List with Voting */}
      <div className={styles.disputesList}>
        {disputes.length > 0 ? (
          disputes.map((dispute) => (
            <div key={dispute.id} className={styles.dispute}>
              <h2>{dispute.description}</h2>
              <p><strong>Severity:</strong> {dispute.severity}</p>
              <div className={styles.voteContainer}>
                <button onClick={() => handleVote(dispute.id, "agree")} className={styles.voteButton}>
                  👍 {dispute.agreeVotes}
                </button>
                <button onClick={() => handleVote(dispute.id, "disagree")} className={styles.voteButton}>
                  👎 {dispute.disagreeVotes}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No disputes available.</p>
        )}
      </div>

      {/* Add a new dispute */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="description">Enter Dispute Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="severity">Set Severity:</label>
          <select id="severity" name="severity" value={severity} onChange={(e) => setSeverity(e.target.value)} required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {severity === "Custom" && (
          <div className={styles.formGroup}>
            <label htmlFor="customSeverity">Enter Custom Severity:</label>
            <input
              type="text"
              id="customSeverity"
              name="customSeverity"
              value={customSeverity}
              onChange={(e) => setCustomSeverity(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className={styles.submitButton}>
          Submit Dispute
        </button>
      </form>
    </div>
  );
};

export default Disputes;
