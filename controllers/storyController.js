// controllers/storyController.js
import Story from "../models/storyModel.js";

// @desc Get all stories
// @route GET /api/stories
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Create new story
// @route POST /api/stories
export const createStory = async (req, res) => {
  try {
    const story = new Story(req.body);
    const saved = await story.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Failed to create story", error: error.message });
  }
};

// @desc Get single story by id
// @route GET /api/stories/:id
export const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
