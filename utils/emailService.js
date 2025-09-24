const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send admin approval request email to super admins
const sendAdminApprovalRequest = async (adminUser, superAdmins) => {
  try {
    if (!superAdmins || superAdmins.length === 0) {
      console.warn("⚠️ No super admins available to send email.");
      return;
    }

    const transporter = createTransporter();
    
    const sendEmails = superAdmins.map(async (admin) => {
      const mailOptions = {
        from: `"EcoAction Platform" <${process.env.EMAIL_USER}>`,
        to: admin.email,
        subject: 'New Admin Approval Request - EcoAction Platform',
        html: `
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
            
            <p>Please log in to the admin dashboard to review and approve or reject this request.</p>
            
            <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
              <p><strong>Login to Admin Dashboard:</strong></p>
              <a href="${process.env.FRONTEND_URL}/admin" 
                 style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
                 Go to Admin Dashboard
              </a>
            </div>
          </div>
        `
      };
      
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(sendEmails);
    console.log(`✅ Approval email sent to: ${superAdmins.map(a => a.email).join(", ")}`);
  } catch (error) {
    console.error('❌ Error sending admin approval email:', error.message);
  }
};

// Send admin approval confirmation email to the user
const sendAdminApprovalConfirmation = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"EcoAction Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Admin Access Has Been Approved - EcoAction Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Admin Access Approved</h2>
          <p>Dear ${user.name},</p>
          
          <p>Your request for admin access to the EcoAction platform has been approved.</p>
          <p>You can now log in to the admin dashboard using your credentials.</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
            <p><strong>Login to Admin Dashboard:</strong></p>
            <a href="${process.env.FRONTEND_URL}/admin" 
               style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
               Go to Admin Dashboard
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you did not request admin access, please contact us immediately.
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin approval confirmation email sent to user');
  } catch (error) {
    console.error('❌ Error sending admin approval confirmation email:', error);
  }
};

// Send admin rejection notification email to the user
const sendAdminRejectionNotification = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"EcoAction Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Admin Access Request - EcoAction Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Admin Access Request Update</h2>
          <p>Dear ${user.name},</p>
          
          <p>Thank you for your interest in becoming an admin for the EcoAction platform.</p>
          <p>After careful review, we regret to inform you that your admin access request has not been approved at this time.</p>
          
          <p>If you have any questions or would like more information, please contact our support team.</p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Thank you for your understanding.
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Admin rejection notification email sent to user');
  } catch (error) {
    console.error('❌ Error sending admin rejection email:', error);
  }
};

// Send new admin created notification
const sendNewAdminNotification = async (user, createdBy) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"EcoAction Platform" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome as an EcoAction Admin',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to the EcoAction Admin Team</h2>
          <p>Dear ${user.name},</p>
          
          <p>You have been added as an administrator to the EcoAction platform by ${createdBy.name} (${createdBy.email}).</p>
          <p>You can now log in to the admin dashboard using your credentials.</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e8; border-radius: 5px;">
            <p><strong>Login to Admin Dashboard:</strong></p>
            <a href="${process.env.FRONTEND_URL}/admin" 
               style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
               Go to Admin Dashboard
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            If you believe this is an error, please contact us immediately.
          </p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ New admin notification email sent');
  } catch (error) {
    console.error('❌ Error sending new admin notification email:', error);
  }
};

module.exports = {
  sendAdminApprovalRequest,
  sendAdminApprovalConfirmation,
  sendAdminRejectionNotification,
  sendNewAdminNotification
};