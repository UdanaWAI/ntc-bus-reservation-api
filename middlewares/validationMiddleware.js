const { body } = require("express-validator");
const validator = require("validator");

// Common validation middleware for fields shared by Driver, Conductor, and User registration
const validateCommonFields = [
  body("name").notEmpty().withMessage("Name is required"),

  body("licenseNumber")
    .isLength({ min: 6 })
    .withMessage("License number must be at least 6 characters")
    .notEmpty()
    .withMessage("License number is required"),
];

// User-specific validation for registration
const validateUserRegistration = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter"),
];

const validateUserLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

module.exports = {
  validateCommonFields,
  validateUserRegistration,
  validateUserLogin,
};
