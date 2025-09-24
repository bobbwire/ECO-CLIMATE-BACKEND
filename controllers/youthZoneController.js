const mongoose = require("mongoose");
const { Challenge, Resource, Leaderboard, Participant } = require("../models/youthZone");
const { sendNotificationEmail } = require("../utils/emailUtils");

// ================== 📌 Challenges ==================

// Get all challenges
exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ status: { $ne: "deleted" } }).sort({ createdAt: -1 });
    res.json(challenges);
  } catch (error) {
    console.error("❌ Error fetching challenges:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single challenge by ID
exports.getChallenge = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.status === "deleted") {
      return res.status(404).json({ message: "Challenge not found" });
    }
    res.json(challenge);
  } catch (error) {
    console.error("❌ Error fetching challenge:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a challenge
exports.createChallenge = async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      organizerEmail: req.body.organizerEmail || "challenges@ecoaction.org",
      organizer: req.body.organizer || "Eco Action Team",
      details: req.body.details || "Join this challenge to make a positive environmental impact!",
    };

    const challenge = new Challenge(challengeData);
    await challenge.save();

    // Notify organizer
    try {
      await sendNotificationEmail(
        "created a new challenge",
        challenge.organizer,
        challenge.organizerEmail,
        challenge.organizerEmail,
        challenge.title
      );
    } catch (emailError) {
      console.error("⚠️ Email failed (challenge create):", emailError.message);
    }

    res.status(201).json(challenge);
  } catch (error) {
    console.error("❌ Error creating challenge:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Update a challenge
exports.updateChallenge = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    res.json(challenge);
  } catch (error) {
    console.error("❌ Error updating challenge:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Soft delete a challenge
exports.deleteChallenge = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    challenge.status = "deleted";
    await challenge.save();

    res.json({ message: "🗑️ Challenge soft-deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting challenge:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Join a challenge
exports.joinChallenge = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid challenge ID" });
    }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || challenge.status === "deleted") {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required to join challenge" });
    }

    // Check if user already joined this challenge
    const existingParticipant = await Participant.findOne({
      email: req.body.email,
      challengeId: challenge._id,
    });

    if (existingParticipant) {
      return res.status(400).json({ message: "You have already joined this challenge" });
    }

    // Create new participant
    const participant = new Participant({
      name: req.body.name,
      email: req.body.email,
      school: req.body.school,
      grade: req.body.grade,
      challengeId: challenge._id,
    });
    await participant.save();

    // Update challenge participants count
    challenge.participants += 1;
    await challenge.save();

    // Notify challenge organizer
    try {
      await sendNotificationEmail(
        "joined your challenge",
        req.body.name,
        req.body.email,
        challenge.organizerEmail,
        challenge.title
      );
    } catch (emailError) {
      console.error("⚠️ Email failed (challenge join):", emailError.message);
    }

    res.json({
      message: "✅ Joined challenge successfully",
      challengeId: challenge._id,
      participant: participant,
    });
  } catch (error) {
    console.error("❌ Error joining challenge:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================== 📌 Resources ==================

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error("❌ Error fetching resources:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createResource = async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      organizer: req.body.organizer || "Education Department",
      organizerEmail: req.body.organizerEmail || "education@climate.org",
    };

    const resource = new Resource(resourceData);
    await resource.save();

    // Notify organizer
    try {
      await sendNotificationEmail(
        "added a new resource",
        resource.organizer,
        resource.organizerEmail,
        resource.organizerEmail,
        resource.title
      );
    } catch (emailError) {
      console.error("⚠️ Email failed (resource create):", emailError.message);
    }

    res.status(201).json(resource);
  } catch (error) {
    console.error("❌ Error creating resource:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ================== 📌 Leaderboard ==================

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find().sort({ rank: 1 });
    res.json(leaderboard);
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateLeaderboard = async (req, res) => {
  try {
    const { rank, name, points, students } = req.body;
    const leaderboard = new Leaderboard({ rank, name, points, students });
    await leaderboard.save();
    res.status(201).json(leaderboard);
  } catch (error) {
    console.error("❌ Error updating leaderboard:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ================== 📌 User-specific ==================

// Joined challenge IDs
exports.getJoinedChallenges = async (req, res) => {
  try {
    const userEmail = req.query.email || req.body.email;
    if (!userEmail) {
      console.warn("⚠️ Missing email in request for getJoinedChallenges");
      return res.status(400).json({ message: "Email is required" });
    }

    const participants = await Participant.find({ email: userEmail });
    const challengeIds = participants.map((p) => p.challengeId);
    res.json(challengeIds);
  } catch (error) {
    console.error("❌ Error fetching joined challenges:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Joined challenge details
exports.getUserChallenges = async (req, res) => {
  try {
    const email = req.query.email || req.body.email;
    if (!email) {
      console.warn("⚠️ Missing email in request for getUserChallenges");
      return res.status(400).json({ message: "Email is required" });
    }

    const challenges = await Participant.find({ email }).populate("challengeId");
    res.json(challenges);
  } catch (error) {
    console.error("❌ Error fetching user challenges:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Impact stats
exports.getImpactStats = async (req, res) => {
  try {
    const totalChallenges = await Challenge.countDocuments({ status: { $ne: "deleted" } });
    const totalParticipants = await Participant.countDocuments();
    const totalResources = await Resource.countDocuments();

    res.json({
      totalChallenges,
      totalParticipants,
      totalResources,
    });
  } catch (error) {
    console.error("❌ Error fetching impact stats:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
