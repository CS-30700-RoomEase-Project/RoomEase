import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import CallService from "../../SharedMethods/CallService";
import styles from "./LeaderboardPopup.module.css";

export default function RoomLeaderboardPopup({ room, isOpen, onClose }) {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState("Chores");
  const [leaderboard, setLeaderboard] = useState([]);

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
    <Popup open={isOpen} modal nested onClose={onClose}>
      <div className={styles.leaderboardModal}>
          <h2 className={styles.title}>Room Leaderboard</h2>
          <p className={styles.description}>
            See who’s been the most active and earned the most points!
          </p>
          {leaderboard.length > 1 ? (
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
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </Popup>
  );
}
