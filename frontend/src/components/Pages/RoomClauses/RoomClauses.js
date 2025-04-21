import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./RoomClauses.module.css";
import CallService from "../../SharedMethods/CallService";

export default function RoomClausesPopup({
  isOpen,
  initialText = "",
  onSave,
  onClose,
  roomId,
}) {
  const [text, setText] = useState("");

  /* Seed textarea every time the popup opens */
  useEffect(() => {
    if (isOpen) setText(initialText);
  }, [isOpen, initialText]);

  const handleSave = () => {
    CallService(
      `room/clauses/${roomId}`,             // PUT
      { clauses: text },
      (res) => {
        // res may be undefined, a string, or { clauses: "..." }
        const updated =
          typeof res?.clauses === "string"
            ? res.clauses
            : typeof res === "string"
            ? res
            : text;

        onSave?.(updated);                 // bubble the change to parent
        onClose();
      },
      (err) => {
        console.error("Failed saving clauses:", err);
        alert("Could not save clauses. Please try again.");
      }
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={style.popupOverlay}>
      <div className={style.popupMenu}>
        <h3>Room Clauses</h3>

        <textarea
          className={style.clausesTextarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter any room‑specific clauses here…"
        />

        <div className={style.buttonGroup}>
          <button className={style.saveButton} onClick={handleSave}>
            Save
          </button>
          <button className={style.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}