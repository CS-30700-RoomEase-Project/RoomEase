// src/Shared_components/BulletinPopup/BulletinPopup.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../../Pages/Room/Room Items/RoomItems.css";
import style from "./BulletinPopup.module.css";

import MemoriesIcon from "./Memories.png";
import QHLogo from "./QuietHours.png";
import RoomClausesIcon from "./RoomClauses.png";
import NotesImage from "./RoomNotes.png";

import RoomClausesPopup from "../../Pages/RoomClauses/RoomClauses";

const API = "http://localhost:5001/api";
const defaultRules = ["No active rules found"];
const defaultNotes = "No current notes";

export default function BulletinPopup({
  isOpen,
  onClose,
  settings = [true, true, true],   // [quietHours, rules, notes]
  roomId,
  onOpenNotes,
}) {
  const [rules, setRules]     = useState([]);
  const [notes, setNotes]     = useState("");
  const [clauses, setClauses] = useState("");
  const [showClauses, setShowClauses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !roomId) return;

    // ─── House Rules (POST getList) ───
    if (settings[1]) {
      fetch(`${API}/rules/getList/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
        .then((r) => r.json())
        .then((data) =>
          setRules(Array.isArray(data) && data.length ? data : defaultRules)
        )
        .catch(() => setRules(defaultRules));
    }

    // ─── Room Notes (POST getList) ───
    if (settings[2]) {
      fetch(`${API}/notes/getList/${roomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
        .then((r) => r.json())
        .then((arr) => {
          const txt =
            Array.isArray(arr) && arr.length ? arr.join("\n") : defaultNotes;
          setNotes(txt);
        })
        .catch(() => setNotes(defaultNotes));
    }

    // ─── Room Clauses (GET) ───
    fetch(`${API}/room/clauses/${roomId}`)
      .then((r) => r.json())
      .then((data) =>
        setClauses(typeof data.clauses === "string" ? data.clauses : "")
      )
      .catch(() => setClauses(""));
  }, [isOpen, roomId, settings]);

  const openMemories = () => {
    onClose();
    navigate(`/room/${roomId}/memories`);
  };
  const gotoHours   = () => navigate(`/quiet-hours/${roomId}`);
  const gotoRules   = () => navigate(`/house-rules/${roomId}`);
  const openNotes   = () => onOpenNotes?.();

  const awardQuestPoints = async (userId, roomId, questType) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/api/room/award-quest-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, roomId, questType }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Points awarded:', result.message);
      } else {
        console.error('Error:', result.message);
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  return (
    <>
      <Popup
        open={isOpen}
        modal
        nested
        onClose={onClose}
        className={style.bulletinContainer}
        overlayClassName={style.bulletinPopupOverlay}
        contentClassName={style.bulletinPopupContent}
      >
        <div className={style.modal}>
          <div className={style.board}>
            <div className={style.frame}>
              <div className={style.content}>

                {/* Quiet Hours */}
                {settings[0] && (
                  <div
                    className={style.quietHoursWrapper}
                    title="Quiet Hours"
                    onClick={gotoHours}
                  >
                    <img
                      src={QHLogo}
                      className={style.quietHours}
                      alt="Quiet Hours"
                    />
                  </div>
                )}

                {/* House Rules */}
                {settings[1] && (
                  <div
                    className={style.rulesBox}
                    title="View House Rules"
                    onClick={gotoRules}
                  >
                    <div className={style.rulesList}>
                      {rules.map((r, i) => (
                        <p key={i} className={style.ruleItem}>
                          • {typeof r === "string" ? r : r.text}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room Notes */}
                {settings[2] && (
                  <div
                    className={style.notesImage}
                    title="View Room Notes"
                    onClick={openNotes}
                  >
                    <img
                      src={NotesImage}
                      alt="Room Notes"
                      className={style.notesIcon}
                    />
                  </div>
                )}

                {/* Room Clauses */}
                <div
                  className={style.clausesWrapper}
                  title="View Room Clauses"
                  onClick={() => setShowClauses(true)}
                >
                  <img
                    src={RoomClausesIcon}
                    alt="Room Clauses"
                    className={style.clausesIcon}
                  />
                </div>

                {/* Memories */}
                <div
                  className={style.memoriesWrapper}
                  title="View Room Memories"
                  onClick={openMemories}
                >
                  <img
                    src={MemoriesIcon}
                    alt="Room Memories"
                    className={style.memoriesIcon}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </Popup>

      {showClauses && (
        <RoomClausesPopup
          isOpen={showClauses}
          roomId={roomId}
          initialText={clauses}
          onSave={(updated) => setClauses(updated)}
          onClose={() => setShowClauses(false)}
        />
      )}
    </>
  );
}
