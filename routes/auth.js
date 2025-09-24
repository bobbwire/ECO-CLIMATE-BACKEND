// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticate } from "../middleware/auth.js";  // ✅ FIXED: use named import

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Temporary in-memory users (replace with DB later)
let users = [];

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, name, email, password: hashedPassword };
    users.push(newUser);

    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Simulate password reset
 */
router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "No account with this email found" });
  }

  res.json({ message: "Reset link sent to " + email });
});

/**
 * @route   GET /api/auth/dashboard
 * @desc    Protected route example
 */
router.get("/dashboard", authenticate, (req, res) => {  // ✅ FIXED: use authenticate
  res.json({ message: `Welcome user ${req.user.id}, this is your dashboard.` });
});

/**
 * @route   POST /api/auth/action
 * @desc    Protected action example
 */
router.post("/action", authenticate, (req, res) => {   // ✅ FIXED: use authenticate
  res.json({ message: "Your eco action was recorded successfully!" });
});

export default router;
