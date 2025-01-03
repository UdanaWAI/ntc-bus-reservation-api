const mongoose = require("mongoose");

// Define Route Schema
const routeSchema = new mongoose.Schema(
  {
    routeId: {
      type: String,
      required: [true, "Route ID is required"],
      unique: true,
      trim: true,
    },
    startLocation: {
      type: String,
      required: [true, "Start location is required"],
      trim: true,
    },
    endLocation: {
      type: String,
      required: [true, "End location is required"],
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Route", routeSchema);
