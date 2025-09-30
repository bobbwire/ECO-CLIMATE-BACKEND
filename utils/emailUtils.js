import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // ✅ Make sure environment variables load

// Ensure environment variables exist
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ EMAIL_USER or EMAIL_PASS is missing in .env file");
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // ✅ Simplifies config for Gmail
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password (NOT your normal Gmail password)
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter is ready to send messages");
  }
});

/**
 * Send a notification email to an organizer
 */
export async function sendNotificationEmail(
  type,
  participantName,
  participantEmail,
  organizerEmail,
  itemName
) {
  try {
    if (!organizerEmail) {
      throw new Error("Organizer email is missing");
    }

    const mailOptions = {
      from: `"Community Climate Action Hub" <${process.env.EMAIL_USER}>`,
      to: organizerEmail,
      subject: `New ${type} - ${itemName}`,
      html: `
        <h2>📢 New ${type}</h2>
        <p><strong>${participantName}</strong> 
        (<a href="mailto:${participantEmail}">${participantEmail}</a>) 
        has submitted a <strong>${type}</strong> for: <em>${itemName}</em>.</p>
        <p>📩 You can contact them directly at: 
        <a href="mailto:${participantEmail}">${participantEmail}</a></p>
        <br>
        <p>Best regards,<br><strong>Community Climate Action Hub</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email sent to ${organizerEmail}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return false;
  }
}
