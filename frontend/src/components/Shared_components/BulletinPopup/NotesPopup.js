import React, { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./NotesPopup.module.css";

export default function NotesPopup({ isOpen, onClose, initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [noteInput, setNoteInput] = useState("");

  const addNote = () => {
    if (noteInput.trim() !== "") {
      setNotes([...notes, noteInput.trim()]);
      setNoteInput("");
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { 
      // Prevent newline if enter is pressed without Shift
      e.preventDefault();
      addNote();
    }
  };

  return (
    <Popup open={isOpen} modal nested onClose={onClose}>
      <div className={styles.notesModal}>
        <h2 className={styles.title}>Bulletin Notes</h2>
        <p className={styles.description}>
          Review your room’s bulletin notes below.
        </p>
        <div className={styles.addNoteContainer}>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Enter note"
            className={styles.noteInput}
            onKeyDown={handleKeyPress}
            maxLength={10000}
          />
          <button onClick={addNote} className={styles.addNoteButton}>
            Add Note
          </button>
        </div>
        {notes && notes.length > 0 ? (
          <ul className={styles.notesList}>
            {notes.map((note, index) => (
              <li key={index} className={styles.noteItem}>
                <div className={styles.noteContent}>{note}</div>
                <button
                  className={styles.deleteButton}
                  onClick={() => deleteNote(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noNotes}>No notes available.</p>
        )}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Popup>
  );
}
