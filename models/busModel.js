const mongoose = require("mongoose");

// Define Bus Schema
const busSchema = new mongoose.Schema(
  {
    busId: {
      type: String,
      required: [true, "Bus ID is required"],
      unique: true,
      trim: true,
    },
    ntcNumber: {
      type: String,
      required: [true, "NTC number is required"],
      unique: true,
      trim: true,
    },
    driverId: {
      type: String,
      ref: "Driver",
      required: [true, "Driver ID is required"],
    },
    conductorId: {
      type: String,
      ref: "Conductor",
      required: [true, "Conductor ID is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Bus capacity is required"],
    },
    routeId: {
      type: String,
      ref: "Route",
      required: [true, "Route ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Bus", busSchema);
