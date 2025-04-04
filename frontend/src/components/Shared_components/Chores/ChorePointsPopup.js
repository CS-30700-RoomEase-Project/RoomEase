import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from './ChorePointsPopup.module.css';

const ChorePointsPopup = ({ isOpen, onClose, roomId }) => {
  const [difficultyLevels, setDifficultyLevels] = useState({ Easy: 3, Medium: 5, Hard: 7 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [points, setPoints] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (!roomId || !isOpen) return;
  
      setLoading(true);
      setError(null);
  
      try {
        // First API call: difficulty levels
        const difficultyRes = await fetch(`http://localhost:5001/api/chores/getPoints/${roomId}`);
        if (!difficultyRes.ok) throw new Error("Failed to fetch difficulty levels");
        const difficultyData = await difficultyRes.json();
        setDifficultyLevels(difficultyData.chorePoints);
  
        // Second API call: room points
        const pointsRes = await fetch(`http://localhost:5001/api/room/points/${roomId}`);
        if (!pointsRes.ok) throw new Error("Failed to fetch room points");
        const pointsData = await pointsRes.json();
        setPoints(pointsData.points); // Adjust based on actual response structure
  
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [roomId, isOpen]);
  

  const handleChange = (e, level) => {
    setDifficultyLevels((prev) => ({
      ...prev,
      [level]: Number(e.target.value),
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/chores/putPoints/${roomId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(difficultyLevels),
      });

      if (!response.ok) throw new Error("Failed to update difficulty levels");

      alert("Difficulty levels updated successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
    onClose();
  };

  return (
    <Popup open={isOpen} onClose={onClose} modal nested>
      {(close) => (
        <div className={styles.popupContainer}>
          <h2>Adjust Chore Points</h2>
  
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <>
              {/* Display user points */}
              <div className={styles.userPoints}>
                <h3>Current Points</h3>
                <ul>
                  {Object.entries(points).map(([user, value]) => (
                    <li key={user}>
                      <strong>{user}</strong>: {value} points
                    </li>
                  ))}
                </ul>
              </div>
  
              {/* Inputs for chore point levels */}
              <div className={styles.inputs}>
                {Object.keys(difficultyLevels).map((level) => (
                  <div key={level} className={styles.inputGroup}>
                    <label>{level}</label>
                    <input
                      type="number"
                      value={difficultyLevels[level]}
                      onChange={(e) => handleChange(e, level)}
                    />
                  </div>
                ))}
                <div className={styles.buttonGroup}>
                  <button className={styles.saveButton} onClick={handleSubmit}>Save</button>
                  <button className={styles.cancelButton} onClick={close}>Cancel</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Popup>
  );
  
};

export default ChorePointsPopup;
