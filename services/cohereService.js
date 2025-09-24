import { CohereClient } from "cohere-ai";

// ✅ Initialize Cohere with API key from .env
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

export const getAIResponse = async (message, chatHistory = [], context = "") => {
  try {
    const response = await cohere.chat({
      model: "command-a-03-2025", // ✅ Latest Cohere model
      message,
      chatHistory,
      preamble: context,
      temperature: 0.7,
      max_tokens: 500,
    });

    return { text: response.text }; // ✅ Always return JSON object
  } catch (error) {
    console.error("❌ Cohere API error:", error);

    // ✅ Safe fallback JSON response
    let fallback = "That's a great climate action question! I can share sustainable practices, eco-friendly tips, or connect you to climate resources.";

    if (message.toLowerCase().includes("carbon") || message.toLowerCase().includes("footprint")) {
      fallback = "Reducing your carbon footprint starts with small changes: 1) Use public transport or bike 2) Reduce meat consumption 3) Switch to energy-efficient appliances 4) Support renewable energy 5) Reduce, reuse, recycle.";
    } else if (message.toLowerCase().includes("grant") || message.toLowerCase().includes("funding")) {
      fallback = "You might qualify for: 1) Solar panel rebates 2) Energy efficiency grants 3) Electric vehicle tax credits 4) Community garden funding.";
    } else if (message.toLowerCase().includes("garden") || message.toLowerCase().includes("compost")) {
      fallback = "To start a community garden: 1) Secure land with sunlight 2) Gather volunteers 3) Get tools and soil 4) Plan irrigation. Composting helps reduce waste and improve soil health!";
    } else if (message.toLowerCase().includes("plastic") || message.toLowerCase().includes("alternative")) {
      fallback = "Eco-friendly alternatives include: 1) Reusable bags 2) Bamboo/stainless steel straws 3) Beeswax wraps 4) Glass containers 5) Solid shampoo bars.";
    }

    return { text: fallback }; // ✅ Ensure frontend always gets JSON
  }
};
