import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Memories.module.css";

/* ---------- helper: compress on client ---------- */
const compressImage = (file) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX = 1024;
      const scale = Math.min(1, MAX / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
        "image/jpeg",
        0.7
      );
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });

/* ---------- main component ---------- */
export default function MemoriesPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [memories, setMemories] = useState([]);
  const [selected, setSelected] = useState(null); // full-screen
  const [deleteId, setDeleteId] = useState(null); // id awaiting delete confirm
  const [edit, setEdit] = useState(null); // { id, text } if editing caption

  const fileInput = useRef(null);
  const captionInput = useRef(null);

  /* ---------- API helpers ---------- */
  const fetchMemories = useCallback(async () => {
    const res = await fetch(`/api/memories/list/${roomId}`);
    setMemories(await res.json());
  }, [roomId]);

  const uploadMemory = useCallback(
    async (file, caption) => {
      const fd = new FormData();
      fd.append("memoryImage", file);
      if (caption) fd.append("caption", caption);
      const res = await fetch(`/api/memories/upload/${roomId}`, {
        method: "POST",
        body: fd,
      });
      if (res.ok) fetchMemories();
    },
    [roomId, fetchMemories]
  );

  const removeMemory = useCallback(
    async (id) => {
      await fetch(`/api/memories/${id}`, { method: "DELETE" });
      fetchMemories();
    },
    [fetchMemories]
  );

  const changeCaption = useCallback(
    async (id, caption) => {
      await fetch(`/api/memories/${id}/caption`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });
      fetchMemories();
    },
    [fetchMemories]
  );

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  /* ---------- event handlers ---------- */
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    await uploadMemory(compressed, captionInput.current.value.trim());
    captionInput.current.value = "";
    e.target.value = "";
  };

  /* ---------- pop-ups ---------- */
  const deletePopup = deleteId
    ? createPortal(
        <div
          className={styles.popupOverlay}
          onClick={() => setDeleteId(null)}
        >
          <div
            className={styles.popupMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete this memory?</h3>
            <p>This action can’t be undone.</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.saveButton}
                onClick={() => {
                  removeMemory(deleteId);
                  setDeleteId(null);
                }}
              >
                Delete
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  const editPopup = edit
    ? createPortal(
        <div
          className={styles.popupOverlay}
          onClick={() => setEdit(null)}
        >
          <div
            className={styles.popupMenu}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Edit Caption</h3>
            <textarea
              value={edit.text}
              onChange={(e) => setEdit({ ...edit, text: e.target.value })}
              className={styles.clausesTextarea}
              rows={3}
            />
            <div className={styles.buttonGroup}>
              <button
                className={styles.saveButton}
                onClick={() => {
                  changeCaption(edit.id, edit.text.trim());
                  setEdit(null);
                }}
              >
                Save
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setEdit(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  /* ---------- render ---------- */
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Room Memories</h1>
        <div className={styles.headerControls}>
          <button onClick={() => navigate(-1)}>Back</button>
          <input
            ref={captionInput}
            className={styles.uploadCaptionInput}
            placeholder="Enter a caption…"
            type="text"
          />
          <button onClick={() => fileInput.current?.click()}>
            Upload Photo
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>
      </header>

      <section className={styles.grid}>
        {memories.map((m, i) => (
          <div
            key={m._id}
            className={styles.polaroid}
            style={{ "--i": i % 5 }}
            onClick={() => setSelected(m._id)}
          >
            <button
              className={styles.deleteBtn}
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(m._id);
              }}
            >
              🗑️
            </button>

            <img
              className={styles.thumb}
              src={`/api/memories/image/${m._id}`}
              alt="memory thumbnail"
            />

            <p
              className={styles.captionText}
              title="Click to edit"
              onClick={(e) => {
                e.stopPropagation();
                setEdit({ id: m._id, text: m.caption || "" });
              }}
            >
              {m.caption || <i>No caption</i>}
            </p>
          </div>
        ))}
      </section>

      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <img
            src={`/api/memories/image/${selected}`}
            alt="enlarged memory"
            className={styles.full}
          />
        </div>
      )}

      {/* pop-ups */}
      {deletePopup}
      {editPopup}
    </div>
  );
}
