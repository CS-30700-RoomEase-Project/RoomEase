import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import { useNavigate } from "react-router-dom";
import "reactjs-popup/dist/index.css";
import style from "./BulletinPopup.module.css";
import "../../Pages/Room/Room Items/RoomItems.css";

import QHLogo          from "./QuietHoursIcon.png";
import NotesImage      from "./notes.png";
import RoomClausesIcon from "./RoomClauses.png";

import RoomClausesPopup from "../../Pages/RoomClauses/RoomClauses";
import CallService      from "../../SharedMethods/CallService";

const defaultRules = ["No active rules found"];
const defaultNotes = "No current notes";

export default function BulletinPopup({
  isOpen,
  onClose,
  settings = [true, true, true],   // [quietHours, rules, notes]  ← clauses always on
  roomId,
  onOpenNotes,
}) {
  const [rules, setRules]       = useState([]);
  const [notes, setNotes]       = useState("");
  const [clauses, setClauses]   = useState("");
  const [showClauses, setShowClauses] = useState(false);

  const navigate = useNavigate();

  /* Fetch everything each time the bulletin opens */
  useEffect(() => {
    if (!isOpen || !roomId) return;

    /* House Rules */
    if (settings[1]) {
      CallService(
        `rules/getList/${roomId}`,
        {},
        (data) =>
          setRules(Array.isArray(data) && data.length ? data : defaultRules),
        () => setRules(defaultRules)
      );
    }

    /* Room Notes */
    if (settings[2]) {
      CallService(
        `room/getNotes/${roomId}`,
        {},
        (data) =>
          setNotes(
            typeof data === "string" && data.trim() ? data : defaultNotes
          ),
        () => setNotes(defaultNotes)
      );
    }

    /* Room Clauses  – always fetched */
    CallService(
      `room/clauses/${roomId}`,
      {},
      (data) => {
        const fetched =
          typeof data?.clauses === "string"
            ? data.clauses
            : typeof data === "string"
            ? data
            : "";
        setClauses(fetched);
      },
      () => setClauses("")
    );
  }, [isOpen, roomId, settings]);

  /* Short helpers */
  const gotoHours   = () => navigate(`/quiet-hours/${roomId}`);
  const gotoRules   = () => navigate(`/house-rules/${roomId}`);
  const openNotes   = () => onOpenNotes?.();
    

    const awardQuestPoints = async (userId, roomId, questType) => {
        try {
            const response = await fetch('http://localhost:5001/api/room/award-quest-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Ensures the body is JSON
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    questType
                }),
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
      {/* Bulletin board itself */}
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
                  <div className={style.quietHoursWrapper}>
                    <img
                      src={QHLogo}
                      className={style.quietHours}
                      alt="Quiet Hours"
                      onClick={gotoHours}
                    />
                  </div>
                )}

                {/* House Rules */}
                {settings[1] && (
                  <div className={style.rulesBox} onClick={gotoRules}>
                    <div className={style.rulesList}>
                      {rules.map((r, i) => (
                        <p key={i} className={style.ruleItem}>
                          • {typeof r === "string" ? r : r.text}
                        </p>
                      ))}
                    </div>
                    <p className={style.viewMore}>Click to view more</p>
                  </div>
                )}

                {/* Room Notes */}
                {settings[2] && (
                  <div className={style.notesImage} onClick={openNotes}>
                    <img
                      src={NotesImage}
                      alt="Room Notes"
                      className={style.notesIcon}
                    />
                  </div>
                )}

                {/* Room Clauses – always visible */}
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
              </div>
            </div>
          </div>
        </div>
      </Popup>

      {/* Editor modal */}
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