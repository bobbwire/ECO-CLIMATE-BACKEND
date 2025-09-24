// routes/educationRoutes.js
import express from "express";
import {
  getResources,
  createResource,
  getResourceById,
  deleteResource,
} from "../controllers/educationController.js";

const router = express.Router();

// MongoDB-backed resource routes
router.get("/resources", getResources);
router.post("/resources", createResource);
router.get("/resources/:id", getResourceById);
router.delete("/resources/:id", deleteResource);

// ✅ TEMPORARY in-memory courses data
const courses = [
  {
    id: 1,
    title: "Introduction to Climate Science",
    lessons: 5,
    progress: 0,
    content: [
      { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Intro" },
      { type: "article", url: "https://example.com/article2", title: "Basics" }
    ]
  }
];

// ✅ Add GET /api/education/courses route
router.get("/courses", (req, res) => {
  res.json(courses);
});

export default router;
