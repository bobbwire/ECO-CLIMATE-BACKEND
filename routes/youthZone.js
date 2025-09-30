// routes/youthZone.js
import express from "express";
import * as youthZoneController from "../controllers/youthZoneController.js";

const router = express.Router();

/* ================== 📌 Challenge Routes ================== */

/**
 * @route   GET /api/youth/challenges/joined
 * @desc    Get challenges the user has joined
 * @access  Public (should be protected if tied to logged-in user)
 */
router.get("/challenges/joined", youthZoneController.getJoinedChallenges);

/**
 * @route   GET /api/youth/challenges/my
 * @desc    Get challenges created by the logged-in user
 * @access  Public (should be protected if tied to logged-in user)
 */
router.get("/challenges/my", youthZoneController.getUserChallenges);

/**
 * @route   GET /api/youth/challenges
 * @desc    Get all challenges
 * @access  Public
 */
router.get("/challenges", youthZoneController.getChallenges);

/**
 * @route   GET /api/youth/challenges/:id
 * @desc    Get a specific challenge by ID
 * @access  Public
 */
router.get("/challenges/:id", youthZoneController.getChallenge);

/**
 * @route   POST /api/youth/challenges
 * @desc    Create a new challenge
 * @access  Public (should be protected later)
 */
router.post("/challenges", youthZoneController.createChallenge);

/**
 * @route   PUT /api/youth/challenges/:id
 * @desc    Update an existing challenge
 * @access  Public (should be protected later)
 */
router.put("/challenges/:id", youthZoneController.updateChallenge);

/**
 * @route   DELETE /api/youth/challenges/:id
 * @desc    Delete a challenge
 * @access  Public (should be protected later)
 */
router.delete("/challenges/:id", youthZoneController.deleteChallenge);

/**
 * @route   POST /api/youth/challenges/:id/join
 * @desc    Join a challenge
 * @access  Public (should be protected later)
 */
router.post("/challenges/:id/join", youthZoneController.joinChallenge);

/* ================== 📌 Resource Routes ================== */

/**
 * @route   GET /api/youth/resources
 * @desc    Get all youth resources
 * @access  Public
 */
router.get("/resources", youthZoneController.getResources);

/**
 * @route   POST /api/youth/resources
 * @desc    Create a new youth resource
 * @access  Public (should be protected later)
 */
router.post("/resources", youthZoneController.createResource);

/* ================== 📌 Leaderboard Routes ================== */

/**
 * @route   GET /api/youth/leaderboard
 * @desc    Get leaderboard data
 * @access  Public
 */
router.get("/leaderboard", youthZoneController.getLeaderboard);

/**
 * @route   POST /api/youth/leaderboard
 * @desc    Update leaderboard (e.g., add points)
 * @access  Public (should be protected later)
 */
router.post("/leaderboard", youthZoneController.updateLeaderboard);

/* ================== 📌 Impact Stats ================== */

/**
 * @route   GET /api/youth/impact-stats
 * @desc    Get youth impact statistics
 * @access  Public
 */
router.get("/impact-stats", youthZoneController.getImpactStats);

export default router;
