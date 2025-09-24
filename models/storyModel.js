// models/storyModel.js
import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ["impact", "action", "solutions", "education"] },
    location: { type: String },
    author: { type: String, default: "Anonymous" },
    video: { type: String },
    audio: { type: String },
    image: { type: String, default: "🌍" },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
