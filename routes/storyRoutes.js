// routes/storyRoutes.js
import express from "express";
import {
  getStories,
  createStory,
  getStoryById,
} from "../controllers/storyController.js";

const router = express.Router();

/**
 * @route   GET /api/stories
 * @desc    Fetch all stories
 * @access  Public
 */
router.get("/", getStories);

/**
 * @route   POST /api/stories
 * @desc    Create a new story
 * @access  Public (could be private later with auth)
 */
router.post("/", createStory);

/**
 * @route   GET /api/stories/:id
 * @desc    Fetch a story by ID
 * @access  Public
 */
router.get("/:id", getStoryById);

export default router;
