const { body } = require("express-validator");
const validator = require("validator"); // Import validator package

// Common validation middleware for fields shared by Driver and Conductor
const validateCommonFields = [
  body("name").notEmpty().withMessage("Name is required"),

  body("licenseNumber")
    .isLength({ min: 6 })
    .withMessage("License number must be at least 6 characters")
    .notEmpty()
    .withMessage("License number is required"),
];

module.exports = { validateCommonFields };
