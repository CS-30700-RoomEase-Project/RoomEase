import React, { useState } from "react";
import styles from "./Disputes.module.css";
import VotingIcon from './VotingIcon.png';  // Import the image

const Disputes = () => {
  const [selectedVote, setSelectedVote] = useState(null);

  const voters = ["Nathan", "John", "Ishan", "Will", "Carter", "Krish"];

  const handleVote = (voter) => {
    setSelectedVote(voter); // Set the selected voter
  };

  return (
    <div className={styles.container}>
      <h1>Dispute Poll</h1>
      <p>Who left the toilet seat up?</p>
      <div className={styles.voteContainer}>
        {voters.map((voter, index) => (
          <div key={index} className={styles.voteOption}>
            <button onClick={() => handleVote(voter)} className={styles.voteButton}>
              {voter}
            </button>
            {selectedVote === voter && (
              <img src={VotingIcon} alt="Voting Icon" className={styles.votingIcon} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disputes;
