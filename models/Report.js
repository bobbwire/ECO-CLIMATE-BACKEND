// models/Report.js
import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reportType: {
    type: String,
    required: true,
    enum: ["pollution", "logging", "waste", "water", "other"],
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", ReportSchema);

export default Report;
