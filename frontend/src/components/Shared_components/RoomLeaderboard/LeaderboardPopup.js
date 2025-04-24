import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./LeaderboardPopup.module.css";
import trophyIcon from './trophy.png';
import CallService from "../../SharedMethods/CallService";

export default function LeaderboardPopup({ room }) {
  const [isOpen, setIsOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen && room && room._id) {
      CallService(`leaderboard/get/${room._id}`, {}, (data) => {
        console.log("Fetched leaderboard data:", data);
        if (data) {
          setLeaderboard(data);
        } else {
          console.error("No leaderboard data received");
        }
      });
    }
  }, [isOpen, room]);

  return (
    <div>
      {/* Trophy Button */}
      <img 
        src={trophyIcon} 
        alt="View Leaderboard" 
        className={styles.trophyButton} 
        onClick={openPopup} 
      />

      {/* Popup */}
      <Popup open={isOpen} modal nested onClose={closePopup}>
        <div className={styles.leaderboardModal}>
          <h2 className={styles.title}>Room Leaderboard</h2>
          <p className={styles.description}>
            See who’s been the most active and earned the most points!
          </p>
          {leaderboard.length > 0 ? (
            <ul className={styles.leaderboardList}>
              {leaderboard.map((entry, index) => (
                <li key={index} className={styles.leaderboardItem}>
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.username}>{entry.username}</span>
                  <span className={styles.stats}>
                    {entry.totalPoints} points
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noData}>No activity recorded yet.</p>
          )}
          <button className={styles.closeButton} onClick={closePopup}>
            Close
          </button>
        </div>
      </Popup>
    </div>
  );
}
