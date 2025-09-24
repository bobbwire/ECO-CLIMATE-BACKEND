import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, enum: ["user", "assistant"], required: true },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
