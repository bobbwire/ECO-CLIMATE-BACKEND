// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js"; // ✅ ensure the file is exactly "User.js" (case-sensitive)

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Authenticate user via JWT
 * Attaches user object to req.user
 */
export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Use default export model
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // attach full user object
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

/**
 * Authorize admin only
 */
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};
