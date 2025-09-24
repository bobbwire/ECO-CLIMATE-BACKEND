import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { getListings, createListing } from "../controllers/directoryController.js";

const router = express.Router();

// ✅ Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Save in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Routes
router.get("/", getListings);
router.post("/", upload.single("media"), createListing);

export default router;
