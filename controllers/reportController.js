// controllers/reportController.js
import Report from "../models/Report.js";
import {
  sendReportEmail,
  sendUserConfirmation,
  sendResolutionEmail,
} from "../middleware/emailMiddleware.js";

// 📌 Create new report
const createReport = async (req, res) => {
  try {
    const { reportType, description, location, isAnonymous, userEmail } = req.body;

    const newReport = new Report({
      reportType,
      description,
      location,
      isAnonymous: isAnonymous === "true" || isAnonymous === true, // normalize
      userEmail: isAnonymous ? null : userEmail,
      photo: req.file ? req.file.filename : null,
    });

    await newReport.save();

    // Notify admin
    await sendReportEmail(newReport);

    // Send confirmation if not anonymous and has an email
    if (!newReport.isAnonymous && newReport.userEmail) {
      await sendUserConfirmation(newReport.userEmail, newReport._id);
    }

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: newReport,
    });
  } catch (error) {
    console.error("❌ Error creating report:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📌 Get all reports (supports query params ?limit=3&status=resolved)
const getReports = async (req, res) => {
  try {
    const { limit, status } = req.query;

    const query = {};
    if (status) query.status = status;

    let reportsQuery = Report.find(query).sort({ createdAt: -1 });

    if (limit) {
      reportsQuery = reportsQuery.limit(Number(limit));
    }

    const reports = await reportsQuery;

    res.json({ success: true, data: reports });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📌 Get single report
const getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, data: report });
  } catch (error) {
    console.error("❌ Error fetching report:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📌 Update report (including resolve hook)
// Update report (only admin can change status)
const updateReport = async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Prevent non-admin from updating status
    if (status && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin can update status" });
    }

    const updateData = { ...req.body, updatedAt: Date.now() };

    const report = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Send resolution email if admin marks as resolved
    if (status === "resolved" && report.userEmail) {
      await sendResolutionEmail(report.userEmail, { ...report.toObject(), notes });
    }

    res.json({ success: true, message: "Report updated successfully", data: report });
  } catch (error) {
    console.error("❌ Error updating report:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// 📌 Delete report
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }
    res.json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting report:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 📌 Stats summary
const getReportStats = async (req, res) => {
  try {
    const stats = await Report.aggregate([
      { $group: { _id: "$reportType", count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export {
  createReport,
  getReports,
  getReport,
  updateReport,
  deleteReport,
  getReportStats,
};
