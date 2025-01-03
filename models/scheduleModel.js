const mongoose = require("mongoose");

// Define Schedule Schema
const scheduleSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      ref: "Route",
      required: [true, "Route ID is required"],
    },
    busId: {
      type: String,
      ref: "Bus",
      required: [true, "Bus ID is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Schedule", scheduleSchema);
