// routes/chatRoutes.js
import express from "express";
import {
  sendMessage,
  getConversation,
  getConversations,
  deleteConversation,
} from "../controllers/chatController.js";
import { optionalAuthenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/chat/message
 * @desc    Send a new message
 * @access  Optional (authenticated users preferred)
 */
router.post("/message", optionalAuthenticate, sendMessage);

/**
 * @route   GET /api/chat/conversation/:conversationId
 * @desc    Get a single conversation by ID
 * @access  Optional (authenticated users preferred)
 */
router.get("/conversation/:conversationId", optionalAuthenticate, getConversation);

/**
 * @route   GET /api/chat/conversations
 * @desc    Get all conversations for logged-in user
 * @access  Optional (authenticated users preferred)
 */
router.get("/conversations", optionalAuthenticate, getConversations);

/**
 * @route   DELETE /api/chat/conversation/:conversationId
 * @desc    Delete a specific conversation
 * @access  Optional (authenticated users preferred)
 */
router.delete("/conversation/:conversationId", optionalAuthenticate, deleteConversation);

export default router;
