import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  // Basic user information
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  
  // User type and role system
  userType: {
    type: String,
    enum: ["individual", "organization", "educator", "student", "admin"],
    default: "individual",
  },
  
  // Admin role system
  role: { 
    type: String, 
    enum: ['user', 'pending_admin', 'admin', 'super_admin'], 
    default: 'user' 
  },
  adminRequestReason: String,
  
  // Additional user information
  location: { 
    type: String, 
    default: "" 
  },
  interests: { 
    type: [String], 
    default: [] 
  },
  
  // Email verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Password reset fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Timestamps
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date, 
    default: Date.now 
  },
  profileCompleted: { 
    type: Boolean, 
    default: false 
  }
});

// Generate password reset token
userSchema.methods.createPasswordResetToken = function (expireMinutes = 15) {
  const buffer = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = buffer;
  this.resetPasswordExpires = Date.now() + expireMinutes * 60 * 1000;
  return buffer;
};

// Generate email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const buffer = crypto.randomBytes(20).toString("hex");
  this.emailVerificationToken = buffer;
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return buffer;
};

// Clear reset token
userSchema.methods.clearPasswordReset = function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpires = undefined;
};

// Update last login timestamp
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = Date.now();
  return this.save();
};

// Virtual for checking if user is admin
userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin' || this.role === 'super_admin';
});

// Virtual for checking if user is super admin
userSchema.virtual('isSuperAdmin').get(function() {
  return this.role === 'super_admin';
});

// Virtual for checking if user has pending admin request
userSchema.virtual('hasPendingAdminRequest').get(function() {
  return this.role === 'pending_admin';
});

// Method to promote user to admin
userSchema.methods.promoteToAdmin = function() {
  this.role = 'admin';
  this.userType = 'admin';
  this.isEmailVerified = true;
  return this.save();
};

// Method to demote admin to regular user
userSchema.methods.demoteToUser = function() {
  this.role = 'user';
  this.userType = 'individual';
  this.adminRequestReason = undefined;
  return this.save();
};

// Register the model safely (fix OverwriteModelError)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
