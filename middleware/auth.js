// middleware/auth.js
import jwt from "jsonwebtoken";

// 🔒 Strict authentication (requires a valid token)
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// 🟢 Optional authentication (token optional)
export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      console.warn("⚠️ Invalid token (continuing without user):", err.message);
    }
  }

  next(); // Always continue
};
