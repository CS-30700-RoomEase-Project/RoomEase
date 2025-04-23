const express  = require("express");
const router   = express.Router();
const multer   = require("multer");
const sharp    = require("sharp");
const Memory   = require("../models/Memory");

const storage = multer.memoryStorage();
const upload  = multer({ storage });

/** POST /api/memories/upload/:roomId
 *  Expects multipart/form-data with field "memoryImage" and optional "caption"
 */
router.post("/upload/:roomId", upload.single("memoryImage"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // compress to max‐width 1024px JPEG@70%
    const compressed = await sharp(req.file.buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();

    const doc = await Memory.create({
      roomId: req.params.roomId,
      image: { data: compressed, contentType: "image/jpeg" },
      caption: req.body.caption?.trim() || "",
    });

    res.json({ id: doc._id, caption: doc.caption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

/** GET /api/memories/list/:roomId */
router.get("/list/:roomId", async (req, res) => {
  try {
    const list = await Memory.find({ roomId: req.params.roomId })
      .sort({ createdAt: -1 })
      .select("_id createdAt caption");
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

/** GET /api/memories/image/:memoryId */
router.get("/image/:memoryId", async (req, res) => {
  try {
    const mem = await Memory.findById(req.params.memoryId);
    if (!mem) return res.status(404).end();
    res.set("Content-Type", mem.image.contentType);
    res.send(mem.image.data);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

/** PUT /api/memories/:memoryId/caption
 *  { caption: "new caption" }
 */
router.put("/:memoryId/caption", async (req, res) => {
  try {
    const { caption } = req.body;
    if (typeof caption !== "string") {
      return res.status(400).json({ error: "Caption must be a string" });
    }
    const updated = await Memory.findByIdAndUpdate(
      req.params.memoryId,
      { caption: caption.trim() },
      { new: true }
    ).select("_id caption");
    if (!updated) return res.status(404).json({ error: "Memory not found" });
    res.json({ id: updated._id, caption: updated.caption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update caption" });
  }
});

/** DELETE /api/memories/:memoryId */
router.delete("/:memoryId", async (req, res) => {
  try {
    const removed = await Memory.findByIdAndDelete(req.params.memoryId);
    if (!removed) return res.status(404).json({ error: "Memory not found" });
    res.json({ message: "Memory deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
