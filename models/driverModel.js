const mongoose = require("mongoose");

// Define Driver Schema
const driverSchema = new mongoose.Schema(
  {
    driverId: {
      type: String,
      required: [true, "Driver ID is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true, // Ensure mobile number is unique
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true, // Ensure license number is unique
    },
    busId: {
      type: String,
      ref: "Bus",
      required: true, // Each driver must be associated with a bus
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Export the model
module.exports = mongoose.model("Driver", driverSchema);
