const mongoose = require("mongoose");

// Define Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    commuterId: {
      type: String,
      ref: "User",
      required: true,
    },
    busId: {
      type: String,
      ref: "Bus",
      required: true,
    },
    routeId: {
      type: String,
      ref: "Route",
      required: true,
    },
    seatNumber: {
      type: [Number],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "booked", "on-hold"],
      default: "available",
    },
    deleted: {
      type: Boolean,
      default: false, // Flag for soft deletion
    },
    deletedAt: {
      type: Date, // Timestamp for soft deletion
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to exclude soft-deleted records by default
bookingSchema.pre("find", function () {
  this.where({ deleted: false });
});
bookingSchema.pre("findOne", function () {
  this.where({ deleted: false });
});
bookingSchema.pre("findById", function () {
  this.where({ deleted: false });
});

// Export the model
module.exports = mongoose.model("Booking", bookingSchema);
