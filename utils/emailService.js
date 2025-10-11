import nodemailer from "nodemailer";

// ===============================
// NODEMAILER TRANSPORT CONFIG
// ===============================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER, // e.g. ecoaction@gmail.com
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // Fix SSL issue on Render
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error.message);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

// ===============================
// GENERIC EMAIL SENDER
// ===============================
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"EcoAction Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to} (${info.messageId})`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

// ===============================
// REUSABLE EMAIL FUNCTIONS
// ===============================

// 1️⃣ Admin Approval Request
export const sendAdminApprovalRequest = async (adminUser, superAdmins) => {
  try {
    if (!superAdmins || superAdmins.length === 0) {
      console.warn("⚠️ No super admins available to send email.");
      return;
    }

    const emailPromises = superAdmins.map((admin) => {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Admin Approval Request</h2>
          <p>A user has requested admin access to the EcoAction platform.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Request Details:</h3>
            <p><strong>Name:</strong> ${adminUser.name}</p>
            <p><strong>Email:</strong> ${adminUser.email}</p>
            <p><strong>Reason:</strong> ${adminUser.adminRequestReason}</p>
            <p><strong>Date:</strong> ${new Date(adminUser.createdAt).toLocaleString()}</p>
          </div>
          <p>Please log in to the admin dashboard to review this request.</p>
          <a href="${process.env.FRONTEND_URL}/admin"
             style="display:inline-block;padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">
             Go to Admin Dashboard
          </a>
        </div>
      `;
      return sendEmail({
        to: admin.email,
        subject: "New Admin Approval Request - EcoAction Platform",
        html,
      });
    });

    await Promise.all(emailPromises);
    console.log(`✅ Approval email sent to: ${superAdmins.map(a => a.email).join(", ")}`);
  } catch (error) {
    console.error("❌ Error sending admin approval email:", error.message);
  }
};

// 2️⃣ Admin Approval Confirmation
export const sendAdminApprovalConfirmation = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Admin Access Approved</h2>
      <p>Dear ${user.name},</p>
      <p>Your request for admin access has been approved.</p>
      <a href="${process.env.FRONTEND_URL}/admin"
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">
         Go to Admin Dashboard
      </a>
      <p style="margin-top:20px;font-size:13px;color:#666;">
        If you did not request this, please contact support.
      </p>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject: "Your Admin Access Has Been Approved - EcoAction Platform",
    html,
  });
};

// 3️⃣ Admin Rejection Notification
export const sendAdminRejectionNotification = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Admin Access Request Update</h2>
      <p>Dear ${user.name},</p>
      <p>Unfortunately, your admin access request has not been approved at this time.</p>
      <p>Thank you for your understanding.</p>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject: "Your Admin Access Request - EcoAction Platform",
    html,
  });
};

// 4️⃣ New Admin Notification
export const sendNewAdminNotification = async (user, createdBy) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Welcome to the EcoAction Admin Team</h2>
      <p>Dear ${user.name},</p>
      <p>You were added as an administrator by ${createdBy.name} (${createdBy.email}).</p>
      <a href="${process.env.FRONTEND_URL}/admin"
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">
         Open Dashboard
      </a>
    </div>
  `;
  await sendEmail({
    to: user.email,
    subject: "Welcome as an EcoAction Admin",
    html,
  });
};
