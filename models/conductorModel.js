const mongoose = require("mongoose");

const conductorSchema = new mongoose.Schema(
  {
    conductorId: {
      type: String,
      required: [true, "Conductor ID is required"],
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
      unique: true, // Ensure no duplicate mobile numbers
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    busId: {
      type: String,
      ref: "Bus",
      required: true, // Every conductor must be assigned to a bus
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Conductor", conductorSchema);
