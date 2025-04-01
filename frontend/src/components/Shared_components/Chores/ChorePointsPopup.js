import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import styles from './ChorePointsPopup.module.css';

const ChorePointsPopup = ({ isOpen, onClose, roomId }) => {
  const [difficultyLevels, setDifficultyLevels] = useState({ Easy: 3, Medium: 5, Hard: 7 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDifficultyLevels = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/chores/getPoints/${roomId}`);
        if (!response.ok) throw new Error("Failed to fetch difficulty levels");
        
        console.log(response);
        const data = await response.json();
        console.log(data);
        setDifficultyLevels(data.chorePoints);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDifficultyLevels();
    console.log(difficultyLevels);
  }, [isOpen]);

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
          )}
        </div>
      )}
    </Popup>
  );
};

export default ChorePointsPopup;
