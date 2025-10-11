// ===== Load environment variables FIRST =====
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import nodemailer from "nodemailer";

// ===== Fix __dirname in ESM =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Initialize App =====
const app = express();

// ===== Ensure uploads directory exists =====
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadsDir);
}

// ===== CORS Configuration (✅ connect Render backend + Vercel frontend) =====
const allowedOrigins = [
  "https://eco-climate.vercel.app", // production frontend
  "http://localhost:5173",          // local dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("❌ Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ===== Middleware =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir)); // Serve uploaded files

// ===== Import Routes =====
import communityRoutes from "./routes/communityRoutes.js";
import authRoutes from "./routes/auth.js";
import educationRoutes from "./routes/educationRoutes.js";
import reportsRoutes from "./routes/reports.js";
import chatRoutes from "./routes/chatRoutes.js";
import youthZoneRoutes from "./routes/youthZone.js";
import storyRoutes from "./routes/storyRoutes.js";
import directoryRoutes from "./routes/directoryRoutes.js";
import jobRoutes from "./routes/jobs.js";

// ===== Use Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/youth", youthZoneRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/jobs", jobRoutes);

// ====== TEST EMAIL ROUTE (to verify Gmail App Password setup) ======
app.get("/api/test-email", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ Gmail SMTP connected successfully.");

    const info = await transporter.sendMail({
      from: `"EcoAction Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "EcoAction Test Email ✔",
      text: "This is a test email from your Render backend (EcoAction).",
      html: "<b>This is a test email from your Render backend (EcoAction).</b>",
    });

    console.log("✅ Email sent:", info.response);
    res.json({ success: true, message: "Test email sent successfully!" });
  } catch (error) {
    console.error("❌ Email test failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== Health Check =====
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uploadsDir,
    emailConfigured: !!process.env.EMAIL_USER,
  });
});

// ===== Serve Frontend in Production (optional) =====
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/build");
  if (fs.existsSync(clientPath)) {
    app.use(express.static(clientPath));
    app.get("*", (req, res) =>
      res.sendFile(path.join(clientPath, "index.html"))
    );
  }
}

// ===== MongoDB Connection =====
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

// ===== Error Handling Middleware =====
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ===== Graceful Shutdown =====
process.on("SIGINT", async () => {
  console.log("👋 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});

// ===== Start Server =====
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📧 Email: ${process.env.EMAIL_USER ? "Configured" : "Not configured"}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "Not set"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
