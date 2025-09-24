import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Article", "Video", "Interactive", "Infographic", "Calculator"],
      default: "Article",
    },
    duration: { type: String }, // e.g. "10 min"
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    content: { type: String, required: true }, // URL or file link
    contentType: {
      type: String,
      enum: ["article", "video", "interactive", "infographic", "tool"],
      default: "article",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Education", educationSchema);
