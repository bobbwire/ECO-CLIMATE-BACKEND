// routes/directoryRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getListings, createListing } from "../controllers/directoryController.js";

const router = express.Router();

// ===== Fix __dirname in ESM =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Multer Storage Config =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Ensure uploads folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ===== Routes =====

/**
 * @route   GET /api/directory
 * @desc    Fetch all directory listings
 * @access  Public
 */
router.get("/", getListings);

/**
 * @route   POST /api/directory
 * @desc    Create a new directory listing with optional media upload
 * @access  Public (should be protected later if needed)
 */
router.post("/", upload.single("media"), createListing);

export default router;
