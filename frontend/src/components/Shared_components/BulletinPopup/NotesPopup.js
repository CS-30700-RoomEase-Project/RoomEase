import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./NotesPopup.module.css";
import CallService from "../../SharedMethods/CallService";

export default function NotesPopup({ room, isOpen, onClose, initialNotes = [] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [noteInput, setNoteInput] = useState("");

  const addNote = () => {
    if (noteInput.trim() !== "") {
      const newNote = noteInput.trim();
      setNotes([newNote, ...notes]);
      setNoteInput("");
      CallService("notes/add/" + room._id, {note: newNote}, (data) => {console.log("NOTE HAS BEEN ADDED: " + data)});
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    CallService("notes/remove/" + room._id, { index: index }, (data) => console.log(data));
  };

  useEffect(() => {
    if (room && room._id) {
      CallService("notes/getList/" + room._id, {}, (data) => {
        console.log("Fetched data:", data);
        if (data) {
          // Reverse the fetched items so that the newest are first
          setNotes(data);
        } else {
          console.error("No data received from API");
        }
      });
    }
  }, [room]);

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
