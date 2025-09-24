import mongoose from "mongoose";

const DirectorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Business/Directory name
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["business", "farmers", "repair", "recycling"],
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    media: { type: String }, // stores uploaded file path or external URL
  },
  { timestamps: true }
);

const Directory = mongoose.model("Directory", DirectorySchema);
export default Directory;
