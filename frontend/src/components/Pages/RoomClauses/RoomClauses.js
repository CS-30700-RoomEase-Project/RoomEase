import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./RoomClauses.module.css";
import CallService from "../../SharedMethods/CallService";

const defaultClauses = [
  "These are your roommate clauses",
  "Add, edit, or change clauses",
  "Change them as you like"
];

export default function Clauses() {
  const { roomId } = useParams(); // Get roomId from URL parameters
  const [clauses, setClauses] = useState([]); // Store the list of clauses
  const [newClause, setNewClause] = useState(""); // New clause input value
  const [editingIndex, setEditingIndex] = useState(null); // To track which clause is being edited
  const [editedClause, setEditedClause] = useState(""); // Store the edited clause text

  // Fetch clauses when the component is mounted
  useEffect(() => {
    CallService(`clauses/getList/${roomId}`, {}, (data) => {
      if (data) {
        // If the data is empty or undefined, add default clauses
        const updatedClauses = data && data.length ? data : [...defaultClauses];
        setClauses(updatedClauses);
      } else {
        console.error("No data received from API");
      }
    });
  }, [roomId]);

  // Save new clause to local state when added
  const handleAddClause = () => {
    if (newClause.trim() !== "") {
      if (!defaultClauses.includes(newClause)) {
        setClauses((prevClauses) => [...prevClauses, newClause]);
        setNewClause(""); // Clear input field
        CallService("clauses/add/" + roomId, { newClause: newClause }, (data) => {
          console.log("New Clause Added: " + newClause);
        });
      } else {
        alert("Cannot add default clauses manually.");
      }
    }
  };

  // Remove clause from local state and update backend, but prevent removal of default clauses
  const handleRemoveClause = (index) => {
    if (defaultClauses.includes(clauses[index])) {
      alert("You cannot remove the default clauses.");
      return; // Prevent removing default clauses
    }

    const clauseToRemove = clauses[index];
    setClauses((prevClauses) => prevClauses.filter((_, i) => i !== index));

    CallService(`clauses/remove/${roomId}`, { text: clauseToRemove }, (data) => {
      console.log("Clause Removed: " + clauseToRemove);
    });
  };

  // Start editing a clause
  const handleEditClause = (index) => {
    setEditingIndex(index); // Set the clause being edited
    setEditedClause(clauses[index]); // Set the edited clause's current value
  };

  // Save the edited clause and update backend, but prevent editing of default clauses
  const handleSaveEditedClause = () => {
    if (editedClause.trim() !== "") {
      if (defaultClauses.includes(clauses[editingIndex])) {
        alert("You cannot edit the default clauses.");
        return; // Prevent editing default clauses
      }

      setClauses((prevClauses) => {
        const updatedClauses = [...prevClauses];
        updatedClauses[editingIndex] = editedClause; // Update the clause in state
        return updatedClauses;
      });

      CallService(`clauses/edit/${roomId}`, { oldText: clauses[editingIndex], newText: editedClause }, (data) => {
        console.log("Clause Edited: " + editedClause);
      });

      setEditingIndex(null); // Clear the editing state
      setEditedClause(""); // Clear the edited text
    }
  };

  return (
    <div className={styles.container}>
      <h2>Roommate Clauses</h2>
      <div className={styles.clausesList}>
        {clauses.map((clause, index) => (
          <div key={index} className={styles.clauseItem}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editedClause}
                  onChange={(e) => setEditedClause(e.target.value)}
                  className={styles.input}
                />
                <button onClick={handleSaveEditedClause} className={styles.saveButton}>Save</button>
                <button onClick={() => setEditingIndex(null)} className={styles.cancelButton}>Cancel</button>
              </>
            ) : (
              <>
                <p>{clause}</p>
                <button className={styles.editButton} onClick={() => handleEditClause(index)}>Edit</button>
                <button className={styles.removeButton} onClick={() => handleRemoveClause(index)}>Remove</button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          value={newClause}
          onChange={(e) => setNewClause(e.target.value)}
          placeholder="Add new clause"
          className={styles.input}
        />
        <button onClick={handleAddClause} className={styles.addButton}>Add Clause</button>
      </div>
    </div>
  );
}
