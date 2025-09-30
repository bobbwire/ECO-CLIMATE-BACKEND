import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  getReportStats,
} from "../controllers/reportController.js";
import { validateReport } from "../middleware/validation.js";
import { authenticateUser, authorizeAdmin } from "../middleware/authMiddleware.js";

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "_");
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => (file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only images allowed"), false)),
});

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
  }
  next(err);
};

// Routes
router.post("/", upload.single("photo"), handleMulterError, validateReport, createReport);
router.get("/", getReports);
router.get("/stats/summary", getReportStats);
router.get("/:id", getReport);

// Protect update & delete routes
router.put("/:id", authenticateUser, updateReport); // Only admin can change status
router.delete("/:id", authenticateUser, authorizeAdmin, deleteReport);

export default router;
