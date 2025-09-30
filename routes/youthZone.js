// routes/youthZone.js
import express from "express";
import * as youthZoneController from "../controllers/youthZoneController.js";

const router = express.Router();

// ================== 📌 Challenge routes ==================
// Order matters! Static routes must come before dynamic `:id`
router.get("/challenges/joined", youthZoneController.getJoinedChallenges);
router.get("/challenges/my", youthZoneController.getUserChallenges);

router.get("/challenges", youthZoneController.getChallenges);
router.get("/challenges/:id", youthZoneController.getChallenge);
router.post("/challenges", youthZoneController.createChallenge);
router.put("/challenges/:id", youthZoneController.updateChallenge);
router.delete("/challenges/:id", youthZoneController.deleteChallenge);
router.post("/challenges/:id/join", youthZoneController.joinChallenge);

// ================== 📌 Resource routes ==================
router.get("/resources", youthZoneController.getResources);
router.post("/resources", youthZoneController.createResource);

// ================== 📌 Leaderboard routes ==================
router.get("/leaderboard", youthZoneController.getLeaderboard);
router.post("/leaderboard", youthZoneController.updateLeaderboard);

// ================== 📌 Impact stats ==================
router.get("/impact-stats", youthZoneController.getImpactStats);

// ✅ Export as default for server.js
export default router;
