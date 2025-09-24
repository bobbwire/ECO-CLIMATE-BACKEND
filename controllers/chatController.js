import Conversation from "../models/Conversation.js";
import { getAIResponse } from "../services/cohereService.js";

// 🌍 Climate context to guide the AI
const CLIMATE_CONTEXT = `
You are a Climate Assistant AI, an expert in environmental science, sustainability, and climate action. 
Your role is to provide accurate, helpful information about:
- Reducing carbon footprint
- Renewable energy options and grants
- Sustainable living practices
- Climate change adaptation strategies
- Environmental policies and initiatives
- Eco-friendly alternatives to common products

If asked about unrelated topics, politely redirect to climate-related questions.
Always provide factual information and acknowledge the limits of your knowledge when uncertain.
`;

// 📩 Send a new message in a conversation
export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user?.id || "anonymous";

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    let conversation;

    // ✅ Find or create conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }
    } else {
      conversation = new Conversation({
        userId,
        messages: [
          {
            text: "Hi! I'm your Climate Assistant. How can I help you today?",
            sender: "assistant",
          },
        ],
      });
    }

    // ✅ Add user message
    conversation.messages.push({
      text: message,
      sender: "user",
    });

    // ✅ Prepare history for Cohere
    const chatHistory = conversation.messages.map((msg) => ({
      role: msg.sender === "user" ? "USER" : "CHATBOT",
      message: msg.text,
    }));

    // ✅ Get AI response (always JSON with `.text`)
    const aiResponse = await getAIResponse(message, chatHistory, CLIMATE_CONTEXT);

    // ✅ Add AI response
    conversation.messages.push({
      text: aiResponse.text,
      sender: "assistant",
    });

    await conversation.save();

    res.json({
      success: true,
      message: aiResponse.text,
      conversationId: conversation._id,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error("❌ sendMessage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// 📖 Get a single conversation
export const getConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id || "anonymous";

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("❌ getConversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
};

// 📚 Get all user conversations
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user?.id || "anonymous";

    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .select("_id createdAt updatedAt messages");

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("❌ getConversations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};

// ❌ Delete conversation
export const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?.id || "anonymous";

    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    res.json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("❌ deleteConversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};
