import mongoose from "mongoose";

/* ================= JOB SCHEMA ================= */
const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Full-time, Part-time
    category: { type: String, required: true },
    salary: { type: String },
    description: { type: String, required: true },
    skills: { type: [String], default: [] },
    applyLink: { type: String, required: true },
    posted: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

/* ================= TRAINING SCHEMA ================= */
const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    duration: { type: String, required: true },
    format: { type: String, required: true }, // e.g., Online, Offline
    category: { type: String, required: true },
    cost: { type: String, required: true },
    description: { type: String, required: true },
    learnMoreLink: { type: String, required: true },
    posted: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

/* ================= INTERNSHIP SCHEMA ================= */
const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    category: { type: String, required: true },
    stipend: { type: String, required: true },
    description: { type: String, required: true },
    applyLink: { type: String, required: true },
    posted: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

/* ================= PROJECT (Funding) SCHEMA ================= */
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    goal: { type: Number, required: true, min: 1 }, // must be > 0
    raised: { type: Number, default: 0 },
    donors: { type: Number, default: 0 },
    image: { type: String, default: "🌍" },
    created: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    donations: [
      {
        amount: { type: Number, required: true, min: 1 },
        donorEmail: { type: String },
        donatedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

/* ================= EXPORT MODELS ================= */
// ✅ Prevent OverwriteModelError by reusing existing models
export const Job =
  mongoose.models.Job || mongoose.model("Job", jobSchema);
export const Training =
  mongoose.models.Training || mongoose.model("Training", trainingSchema);
export const Internship =
  mongoose.models.Internship || mongoose.model("Internship", internshipSchema);
export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
