// routes/educationRoutes.js
import express from "express";
import {
  getResources,
  createResource,
  getResourceById,
  deleteResource,
} from "../controllers/educationController.js";

const router = express.Router();

// ===== Resource Routes (MongoDB-backed) =====

/**
 * @route   GET /api/education/resources
 * @desc    Fetch all resources
 * @access  Public
 */
router.get("/resources", getResources);

/**
 * @route   POST /api/education/resources
 * @desc    Create a new resource
 * @access  Public (should be protected later if needed)
 */
router.post("/resources", createResource);

/**
 * @route   GET /api/education/resources/:id
 * @desc    Fetch single resource by ID
 * @access  Public
 */
router.get("/resources/:id", getResourceById);

/**
 * @route   DELETE /api/education/resources/:id
 * @desc    Delete a resource
 * @access  Public (should be protected later if needed)
 */
router.delete("/resources/:id", deleteResource);

// ===== Temporary In-Memory Courses =====
const courses = [
  {
    id: 1,
    title: "Introduction to Climate Science",
    lessons: 5,
    progress: 0,
    content: [
      { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Intro" },
      { type: "article", url: "https://example.com/article2", title: "Basics" },
    ],
  },
];

/**
 * @route   GET /api/education/courses
 * @desc    Fetch sample courses (temporary in-memory data)
 * @access  Public
 */
router.get("/courses", (req, res) => {
  res.json(courses);
});

export default router;
