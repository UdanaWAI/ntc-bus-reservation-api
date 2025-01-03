const QRCode = require("qrcode");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const Route = require("../models/routeModel");
const User = require("../models/userModel");
const { holdSeat } = require("../services/bookingService");
const { sendBookingEmail } = require("../middlewares/emailMiddleware");

// Create a booking for multiple seats
exports.createBooking = async (req, res) => {
  try {
    const { busId, routeId, seatNumbers } = req.body; // seatNumbers is now an array
    const commuterId = req.user.id; // Get the commuter's user ID from the JWT token

    // Check if bus and route exist
    const bus = await Bus.findOne({ busId }); // String ID check
    if (!bus) {
      return res.status(400).json({ message: "Bus not found" });
    }

    const route = await Route.findOne({ routeId }); // String ID check
    if (!route) {
      return res.status(400).json({ message: "Route not found" });
    }

    // Loop through seatNumbers to check if any seat is already booked
    for (let seatNumber of seatNumbers) {
      const existingBooking = await Booking.findOne({
        busId,
        seatNumber,
        status: "booked",
      });

      if (existingBooking) {
        return res
          .status(400)
          .json({ message: `Seat ${seatNumber} is already booked` });
      }
    }

    // Create the booking for each seat number
    const bookings = [];
    for (let seatNumber of seatNumbers) {
      const booking = new Booking({
        commuterId,
        busId,
        routeId,
        seatNumber,
        status: "booked", // Initially set the status to "booked"
      });

      await booking.save();
      bookings.push(booking);
    }

    // Store the booking information in the request body to pass to the middleware
    req.body.bookings = bookings;
    req.body.commuterId = commuterId;
    req.body.busId = busId;
    req.body.routeId = routeId;
    req.body.seatNumbers = seatNumbers;

    // Call the email function directly, don't use next() here
    await sendBookingEmail(req, res);
    // Call the email middleware
    return res.status(201).json({
      message: "Booking created successfully, and confirmation email sent!",
      bookings,
    });
  } catch (error) {
    console.error("Error details:", error); // Log the error for debugging
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message || error,
    });
  }
};

// Hold a seat for a user
exports.holdSeatForUser = async (req, res) => {
  try {
    const { busId, routeId, seatNumbers } = req.body;
    const commuterId = req.user.id; // Get commuter's user ID from JWT

    // Check if all seats can be held
    const unavailableSeats = [];
    for (const seatNumber of seatNumbers) {
      const booking = await holdSeat(commuterId, busId, routeId, seatNumber);
      if (!booking) {
        unavailableSeats.push(seatNumber);
      }
    }

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.join(
          ", "
        )} are already on-hold or booked`,
      });
    }

    res.status(201).json({
      message:
        "Seats are on-hold for 12 minutes. Please complete your booking.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to hold seats", error: error.message });
  }
};

// Get all bookings for a commuter (filter by commuterId)
exports.getBookingsByCommuter = async (req, res) => {
  try {
    const commuterId = req.user.id; // Get the commuter's user ID from the JWT token

    // Fetch all bookings for the commuter
    const bookings = await Booking.find({ commuterId });

    // Manually fetch related details
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const busDetails = await Bus.findOne({ busId: booking.busId }); // String ID check
        const routeDetails = await Route.findOne({ routeId: booking.routeId }); // String ID check

        return {
          ...booking.toObject(),
          bus: busDetails
            ? {
                ntcNumber: busDetails.ntcNumber,
                capacity: busDetails.capacity,
              }
            : null,
          route: routeDetails
            ? {
                startLocation: routeDetails.startLocation,
                endLocation: routeDetails.endLocation,
              }
            : null,
        };
      })
    );

    res.status(200).json({ bookings: bookingsWithDetails });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Fetch related details manually
    const busDetails = await Bus.findOne({ busId: booking.busId }); // String ID check
    const routeDetails = await Route.findOne({ routeId: booking.routeId }); // String ID check

    res.status(200).json({
      booking: {
        ...booking.toObject(),
        bus: busDetails
          ? {
              ntcNumber: busDetails.ntcNumber,
              capacity: busDetails.capacity,
            }
          : null,
        route: routeDetails
          ? {
              startLocation: routeDetails.startLocation,
              endLocation: routeDetails.endLocation,
            }
          : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking", error });
  }
};

// Get bookings by routeId
exports.getBookingsByRouteId = async (req, res) => {
  try {
    const bookings = await Booking.find({ routeId: req.params.routeId }); // String routeId check

    // Fetch related details for each booking
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const busDetails = await Bus.findOne({ busId: booking.busId }); // String busId check

        return {
          ...booking.toObject(),
          bus: busDetails
            ? {
                ntcNumber: busDetails.ntcNumber,
                capacity: busDetails.capacity,
              }
            : null,
        };
      })
    );

    res.status(200).json({ bookings: bookingsWithDetails });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings by routeId", error });
  }
};

// Update a booking status (only for admins)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!["available", "booked", "on-hold"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update booking status
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking", error });
  }
};

// Cancel a booking (commuter can cancel their own booking)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "available" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking canceled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking", error });
  }
};

// Soft delete a booking
exports.softDeleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ message: "Booking soft deleted successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to soft delete booking", error });
  }
};

// Restore a soft-deleted booking
exports.restoreBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: null },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking restored successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to restore booking", error });
  }
};
