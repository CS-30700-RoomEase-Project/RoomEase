// src/Pages/RoomClauses/RoomClausesPopup.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import style from "./RoomClauses.module.css";

export default function RoomClausesPopup({
  isOpen,
  initialText = "",
  roomId,
  onSave,   // (updatedText) => void
  onClose,  // () => void
}) {
  const [text, setText] = useState("");

  /* populate textarea each time the popup opens */
  useEffect(() => {
    if (isOpen) setText(initialText);
  }, [isOpen, initialText]);

  /* PUT /api/room/clauses/:roomId */
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/room/clauses/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clauses: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();           // { clauses: "..." }
      const updated = typeof data.clauses === "string" ? data.clauses : text;

      onSave?.(updated);                       // bubble to parent
      onClose();
    } catch (err) {
      console.error("Failed saving clauses:", err);
      alert("Could not save clauses. Please try again.");
    }
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
          placeholder="Enter any room-specific clauses here…"
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
