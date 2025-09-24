import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

// ========================
// User Model
// ========================
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    location: String,
    interests: [String],
    userType: {
      type: String,
      enum: ["individual", "organization", "educator", "student", "business"],
      default: "individual"
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    approvalDate: Date,
    reason: String // For admin request reason
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to check if super admin limit is reached
userSchema.statics.canCreateSuperAdmin = async function() {
  const count = await this.countDocuments({ role: 'super_admin' });
  return count < 2; // Maximum 2 super admins
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);

// ========================
// Incident Model
// ========================
const incidentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['pollution', 'logging', 'waste', 'water', 'other']
    },
    location: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending"
    },
    photos: [String]
  },
  { timestamps: true }
);

export const Incident = mongoose.models.Incident || mongoose.model("Incident", incidentSchema);

// ========================
// Event Model
// ========================
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    time: String,
    location: {
      type: String,
      required: true
    },
    organizer: {
      type: String,
      required: true
    },
    participants: {
      type: Number,
      default: 0
    },
    description: String,
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

// ========================
// Group Model
// ========================
const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    focus: {
      type: String,
      required: true
    },
    members: {
      type: Number,
      default: 0
    },
    organizer: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);

// ========================
// Project Model
// ========================
const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    volunteers: {
      type: Number,
      default: 0
    },
    description: String,
    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning"
    }
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

// ========================
// Resource Model
// ========================
const resourceSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Article', 'Interactive', 'Video', 'Calculator', 'Course']
    },
    duration: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description: String,
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published"
    }
  },
  { timestamps: true }
);

export const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

// ========================
// Challenge Model
// ========================
const challengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    participants: {
      type: Number,
      default: 0
    },
    points: {
      type: Number,
      default: 0
    },
    deadline: Date,
    badge: String,
    status: {
      type: String,
      enum: ["active", "upcoming", "completed"],
      default: "active"
    }
  },
  { timestamps: true }
);

export const Challenge = mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);

// ========================
// Story Model
// ========================
const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    location: String,
    category: {
      type: String,
      enum: ['impact', 'action', 'solutions', 'education']
    },
    excerpt: {
      type: String,
      required: true
    },
    image: String,
    status: {
      type: String,
      enum: ["published", "pending", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export const Story = mongoose.models.Story || mongoose.model("Story", storySchema);