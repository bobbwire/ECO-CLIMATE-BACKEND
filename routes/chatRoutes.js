import express from "express";
import {
  sendMessage,
  getConversation,
  getConversations,
  deleteConversation,
} from "../controllers/chatController.js";
import { optionalAuthenticate } from "../middleware/auth.js";

const router = express.Router();

// ✅ Send a message
router.post("/message", optionalAuthenticate, sendMessage);

// ✅ Get single conversation by ID
router.get("/conversation/:conversationId", optionalAuthenticate, getConversation);

// ✅ Get all conversations for logged-in user
router.get("/conversations", optionalAuthenticate, getConversations);

// ✅ Delete a conversation
router.delete("/conversation/:conversationId", optionalAuthenticate, deleteConversation);

export default router;
