// models/youthZone.js
import mongoose from "mongoose";

// ================== 📌 Challenge Schema ==================
const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Challenge title is required"] },
    description: { type: String, required: [true, "Challenge description is required"] },
    participants: { type: Number, default: 0 },
    points: { type: Number, required: [true, "Challenge points are required"], min: 0 },
    deadline: { type: Date, required: [true, "Deadline is required"] },
    badge: { type: String, default: "🌍" },
    joinLink: { type: String },
    details: { type: String },
    organizer: { type: String, default: "Eco Action Team", required: [true, "Organizer name is required"] },
    organizerEmail: { type: String, required: [true, "Organizer email is required"] },
    status: { type: String, enum: ["active", "deleted"], default: "active" },
  },
  { timestamps: true }
);

// ================== 📌 Resource Schema ==================
const ResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Resource title is required"] },
    type: { type: String, required: [true, "Resource type is required"] },
    grade: { type: String, required: [true, "Grade is required"] },
    duration: { type: String, required: [true, "Duration is required"] },
    downloadLink: { type: String, required: [true, "Download link is required"] },
    description: { type: String },
    organizer: { type: String, default: "Education Department" },
    organizerEmail: { type: String, default: "education@climate.org" },
  },
  { timestamps: true }
);

// ================== 📌 Leaderboard Schema ==================
const LeaderboardSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true, min: 1 },
    name: { type: String, required: true },
    points: { type: Number, required: true, min: 0 },
    students: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// ================== 📌 Participant Schema ==================
const ParticipantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Participant name is required"] },
    email: { type: String, required: [true, "Participant email is required"] },
    school: { type: String, required: [true, "School name is required"] },
    grade: { type: String, required: [true, "Grade level is required"] },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: [true, "Challenge ID is required"],
    },
    joinedAt: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// ================== 📌 Exports ==================
export const Challenge = mongoose.model("Challenge", ChallengeSchema);
export const Resource = mongoose.model("Resource", ResourceSchema);
export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
export const Participant = mongoose.model("Participant", ParticipantSchema);
