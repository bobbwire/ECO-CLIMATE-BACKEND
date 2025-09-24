// routes/storyRoutes.js
import express from "express";
import { getStories, createStory, getStoryById } from "../controllers/storyController.js";

const router = express.Router();

router.get("/", getStories);
router.post("/", createStory);
router.get("/:id", getStoryById);

export default router;
