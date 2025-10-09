import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// General reusable email sender
const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: "EcoAction Platform <noreply@eco-climate.app>", // You can customize this domain later
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

// Send admin approval request email to super admins
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
            <p><strong>Request Reason:</strong> ${adminUser.adminRequestReason}</p>
            <p><strong>Request Date:</strong> ${new Date(adminUser.createdAt).toLocaleString()}</p>
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

// Send admin approval confirmation email to the user
export const sendAdminApprovalConfirmation = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Admin Access Approved</h2>
      <p>Dear ${user.name},</p>
      <p>Your request for admin access to the EcoAction platform has been approved.</p>
      <a href="${process.env.FRONTEND_URL}/admin"
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">
         Go to Admin Dashboard
      </a>
      <p style="margin-top:30px;color:#666;font-size:14px;">
        If you did not request admin access, please contact us immediately.
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Your Admin Access Has Been Approved - EcoAction Platform",
    html,
  });
};

// Send admin rejection notification email to the user
export const sendAdminRejectionNotification = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Admin Access Request Update</h2>
      <p>Dear ${user.name},</p>
      <p>Thank you for your interest in becoming an admin for the EcoAction platform.</p>
      <p>After review, your admin access request has not been approved at this time.</p>
      <p style="margin-top:30px;color:#666;font-size:14px;">
        Thank you for your understanding.
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Your Admin Access Request - EcoAction Platform",
    html,
  });
};

// Send new admin created notification
export const sendNewAdminNotification = async (user, createdBy) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to the EcoAction Admin Team</h2>
      <p>Dear ${user.name},</p>
      <p>You have been added as an administrator by ${createdBy.name} (${createdBy.email}).</p>
      <a href="${process.env.FRONTEND_URL}/admin"
         style="display:inline-block;padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:4px;">
         Go to Admin Dashboard
      </a>
      <p style="margin-top:30px;color:#666;font-size:14px;">
        If you believe this is an error, please contact us immediately.
      </p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Welcome as an EcoAction Admin",
    html,
  });
};
