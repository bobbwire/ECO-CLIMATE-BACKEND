// middleware/youthDeleteMiddleware.js
const { Challenge } = require("../models/youthZoneModels");

// ✅ Soft Delete Middleware for Youth Zone
const checkYouthDelete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    if (challenge.isDeleted) {
      return res.status(410).json({ success: false, message: "Challenge has already been deleted" });
    }

    req.challenge = challenge; // attach to request
    next();
  } catch (error) {
    console.error("❌ Youth delete check error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { checkYouthDelete };
