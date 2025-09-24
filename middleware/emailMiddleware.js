// middleware/emailMiddleware.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail SMTP
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // app password (not raw Gmail password)
  },
});

/**
 * Send email when a new report is submitted
 */
const sendReportEmail = async (report) => {
  try {
    const mailOptions = {
      from: `"Peace Platform" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // defined in .env
      subject: `📌 New Report Submitted - ${report.reportType}`,
      html: `
        <h2>New Incident Report</h2>
        <p><strong>Type:</strong> ${report.reportType}</p>
        <p><strong>Description:</strong> ${report.description}</p>
        <p><strong>Location:</strong> ${report.location}</p>
        <p><strong>Anonymous:</strong> ${report.isAnonymous ? "Yes" : "No"}</p>
        <p><strong>Status:</strong> ${report.status}</p>
        <p><strong>Submitted At:</strong> ${new Date(report.createdAt).toLocaleString()}</p>
        ${
          report.photo
            ? `<p><strong>Photo:</strong> Attached</p>`
            : `<p><strong>Photo:</strong> None</p>`
        }
      `,
      attachments: report.photo
        ? [
            {
              filename: report.photo,
              path: `uploads/${report.photo}`,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Report email sent successfully");
  } catch (error) {
    console.error("❌ Error sending report email:", error.message);
  }
};

/**
 * Send confirmation to user (if not anonymous)
 */
const sendUserConfirmation = async (userEmail, reportId) => {
  try {
    const mailOptions = {
      from: `"Peace Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "✅ Report Received",
      html: `
        <h2>Thank you for your report</h2>
        <p>Your report has been submitted successfully and is under review.</p>
        <p><strong>Report ID:</strong> ${reportId}</p>
        <p>We appreciate your effort in building peace in your community.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ User confirmation email sent");
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error.message);
  }
};

/**
 * Notify user when their report is resolved
 */
const sendResolutionEmail = async (userEmail, report) => {
  try {
    const mailOptions = {
      from: `"Peace Platform" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "📍 Your Report Has Been Resolved",
      html: `
        <h2>Good news!</h2>
        <p>Your report has been marked as <strong>resolved</strong>.</p>
        <p><strong>Type:</strong> ${report.reportType}</p>
        <p><strong>Description:</strong> ${report.description}</p>
        <p><strong>Location:</strong> ${report.location}</p>
        <p><strong>Resolution Notes:</strong> ${report.notes || "N/A"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Resolution email sent");
  } catch (error) {
    console.error("❌ Error sending resolution email:", error.message);
  }
};

export { sendReportEmail, sendUserConfirmation, sendResolutionEmail };
