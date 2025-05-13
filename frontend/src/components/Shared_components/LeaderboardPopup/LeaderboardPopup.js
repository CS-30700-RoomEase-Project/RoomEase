// LeaderboardPopup.jsx

import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import styles from './LeaderboardPopup.module.css';

const LeaderboardPopup = ({ isOpen, onClose }) => {
  const [roomData, setRoomData] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState('Chores');
  const [leaderboard, setLeaderboard] = useState([]);

  // Load roomData from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem('roomData');
    if (data) {
      const parsed = JSON.parse(data);
      setRoomData(parsed);
    } else {
      console.warn('No room data in localStorage');
    }
  }, []);

  // Recompute leaderboard whenever roomData, month, or map changes
  useEffect(() => {
    if (
      roomData?.completedTasks &&
      roomData.completedTasks.length > 0
    ) {
      const selectedTask = roomData.completedTasks[selectedMonthIndex] || {};
      const mapData = selectedTask[selectedMap] || [];
      const sortedEntries = [...mapData].sort((a, b) => b.value - a.value);
      setLeaderboard(sortedEntries);
    } else {
      setLeaderboard([]);
    }
  }, [roomData, selectedMonthIndex, selectedMap]);

  return (
    <Popup
      open={isOpen}
      onClose={onClose}
      modal
      overlayClassName={styles['popup-container']}
    >
      <div className={styles['popup-content']}>
        <div className={styles['popup-header']}>
          <h2>Monthly Leaderboard</h2>
          <button onClick={onClose} className={styles['close-btn']}>
            ×
          </button>
        </div>

        {!roomData ? (
          <div className={styles['loading-container']}>
            Loading leaderboard...
          </div>
        ) : (
          <>
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <label>Select Month:</label>
                <select
                  value={selectedMonthIndex}
                  onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                >
                  {roomData.completedTasks.map((task, idx) => {
                    const d = new Date(task.date);
                    const month = d.toLocaleString('default', { month: 'long' });
                    const year = d.getFullYear();
                    return (
                      <option key={idx} value={idx}>
                        {month} {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className={styles.controlGroup}>
                <label>Select Metric:</label>
                <select
                  value={selectedMap}
                  onChange={(e) => setSelectedMap(e.target.value)}
                >
                  <option value="Chores">Chores</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
            </div>

            {leaderboard.length > 0 ? (
              <div className={styles['leaderboard-list']}>
                {leaderboard.map((entry, idx) => (
                  <div key={entry._id || idx} className={styles['leaderboard-item']}>
                    <span className={styles.rank}>#{idx + 1}</span>
                    <span>{entry.user.username}</span>
                    <span>{entry.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles['empty-state']}>
                No data for this metric this month.
              </div>
            )}
          </>
        )}
      </div>
    </Popup>
  );
};

export default LeaderboardPopup;
