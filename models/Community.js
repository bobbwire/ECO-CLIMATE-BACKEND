import mongoose from "mongoose";

// ===== GROUP =====
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    focus: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true },
    organizerEmail: { type: String, required: true },
    members: [
      {
        name: String,
        email: String,
        message: String,
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false }, // soft delete flag
  },
  { timestamps: true }
);

// ===== EVENT =====
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true },
    organizerEmail: { type: String, required: true },
    rsvps: [
      {
        name: String,
        email: String,
        guests: Number,
        rsvpAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false }, // soft delete flag
  },
  { timestamps: true }
);

// ===== PROJECT =====
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goals: { type: String, required: true },
    timeline: { type: String, required: true },
    resources: { type: String },
    organizer: { type: String, required: true },
    organizerEmail: { type: String, required: true },
    volunteers: [
      {
        name: String,
        email: String,
        contribution: String,
        volunteeredAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false }, // soft delete flag
  },
  { timestamps: true }
);

// Register models (avoid OverwriteModelError on hot reloads)
export const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
