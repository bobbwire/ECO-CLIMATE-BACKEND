// middleware/validation.js

const { body, validationResult } = require("express-validator");

const validateReport = [
  // Report type validation
  body("reportType")
    .isIn(["pollution", "logging", "waste", "water", "other"])
    .withMessage("Invalid report type"),

  // Description validation
  body("description")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long"),

  // Location validation
  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  // isAnonymous validation (optional but must be boolean if present)
  body("isAnonymous")
    .optional()
    .isBoolean()
    .withMessage("isAnonymous must be true or false")
    .toBoolean(), // convert "true"/"false" strings to actual booleans

  // userEmail required if not anonymous
  body("userEmail")
    .if(body("isAnonymous").equals("false"))
    .notEmpty()
    .withMessage("Email is required when not anonymous")
    .isEmail()
    .withMessage("Invalid email address"),

  // Middleware to check validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  validateReport,
};
