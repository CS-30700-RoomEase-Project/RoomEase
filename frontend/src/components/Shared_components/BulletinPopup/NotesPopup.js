import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import styles from "./NotesPopup.module.css";
import CallService from "../../SharedMethods/CallService";

export default function NotesPopup({ room, isOpen, onClose, initialNotes = [] }) {
  // When a specific room is provided, notes will be an array.
  // When room is null (aggregated view), notesAggregated will be an object with keys = room IDs.
  const [notes, setNotes] = useState(initialNotes);
  const [aggregatedNotes, setAggregatedNotes] = useState({});
  const [noteInput, setNoteInput] = useState("");

  // Function to add a new note (only applies to a specific room view)
  const addNote = () => {
    if (noteInput.trim() !== "") {
      const newNote = noteInput.trim();
      // Only add new note if a specific room is selected
      if (room && room._id) {
        setNotes([newNote, ...notes]);
        setNoteInput("");
        CallService("notes/add/" + room._id, { note: newNote }, (data) => {
          console.log("NOTE HAS BEEN ADDED: " + data);
        });
      }
      // Otherwise, in aggregated view, you might choose not to allow adding a note
      // or handle it differently.
    }
  };

  const deleteNote = (index) => {
    // If a specific room is selected, delete from that room
    if (room && room._id) {
      const updatedNotes = notes.filter((_, i) => i !== index);
      setNotes(updatedNotes);
      CallService("notes/remove/" + room._id, { index: index }, (data) => console.log(data));
    }
  };

  useEffect(() => {
    // If a specific room is provided, use the individual endpoint
    if (room && room._id) {
      CallService("notes/getList/" + room._id, {}, (data) => {
        console.log("Fetched data:", data);
        if (data) {
          setNotes(data);
        } else {
          console.error("No data received from API");
        }
      });
    } else {
      // Aggregated notes view: room is null.
      // Get userId from localStorage (adjust key as needed – here we assume "userData" holds it)
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      console.log("fetching notes ");
      CallService("notes/getListMaster/" + userData.userId, {}, (data) => {
         console.log("Fetched aggregated notes:", data);
         if (data) {
           setAggregatedNotes(data);
         } else {
           console.error("No aggregated notes received from API");
         }
      });
    }
  }, [room]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addNote();
    }
  };

  // Render differently when aggregated
  const renderNotesContent = () => {
    if (room && room._id) {
      // Individual room view: render flat list
      return notes && notes.length > 0 ? (
        <ul className={`${styles.notesList}`}>
          {notes.map((note, index) => (
            <li key={index} className={styles.noteItem}>
              <div className={styles.noteContent}>{note}</div>
              <button className={styles.deleteButton} onClick={() => deleteNote(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noNotes}>No notes available.</p>
      );
    } else {
      // Aggregated view: wrap groups into a scrollable container
      return Object.keys(aggregatedNotes).length > 0 ? (
        <div className={styles.notesAggregatedContainer}>
          {Object.keys(aggregatedNotes).map((roomId) => {
            const { roomName, notes } = aggregatedNotes[roomId];
            return (
              <div key={roomId} className={styles.noteGroup}>
                <h3 className={styles.groupTitle}>
                  {roomName || "Unnamed Room"}
                </h3>
                {notes && notes.length > 0 ? (
                  <ul className={styles.notesList}>
                    {notes.map((note, idx) => (
                      <li key={idx} className={styles.noteItem}>
                        <div className={styles.noteContent}>{note}</div>
                        {/* Optionally allow deletion */}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noNotes}>No notes available.</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles.noNotes}>No aggregated notes available.</p>
      );
    }
  };

  return (
    <Popup open={isOpen} modal nested onClose={onClose}>
      <div className={styles.notesModal}>
        <h2 className={styles.title}>Bulletin Notes</h2>
        <p className={styles.description}>Review your room’s bulletin notes below.</p>
        {room && room._id && (
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
        )}
        {renderNotesContent()}
        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </Popup>
  );
}