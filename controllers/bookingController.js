const QRCode = require("qrcode");
const Booking = require("../models/bookingModel");
const Bus = require("../models/busModel");
const Route = require("../models/routeModel");
const User = require("../models/userModel");
const { holdSeat } = require("../services/bookingService");
const { sendBookingEmail } = require("../middlewares/emailMiddleware");
const cacheService = require("../services/cacheService"); // Import cacheService

// Create a booking for multiple seats
exports.createBooking = async (req, res) => {
  try {
    const { busId, routeId, seatNumbers } = req.body;
    const commuterId = req.user.id; // Get commuter's user ID from JWT token

    // Check if bus and route exist
    const bus = await Bus.findOne({ busId });
    if (!bus) {
      return res.status(400).json({ message: "Bus not found" });
    }

    const route = await Route.findOne({ routeId });
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

    // Invalidate the cache after creating bookings
    cacheService.delCache(`bookings_${commuterId}`);

    // Store the booking information in the request body to pass to the middleware
    req.body.bookings = bookings;
    req.body.commuterId = commuterId;
    req.body.busId = busId;
    req.body.routeId = routeId;
    req.body.seatNumbers = seatNumbers;

    // Call the email function directly, don't use next() here
    await sendBookingEmail(req, res);

    return res.status(201).json({
      message: "Booking created successfully, and confirmation email sent!",
      bookings,
    });
  } catch (error) {
    console.error("Error details:", error);
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
    const commuterId = req.user.id;

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

    // Try to get cached bookings first
    const cachedBookings = await cacheService.getCache(
      `bookings_${commuterId}`
    );
    if (cachedBookings) {
      return res.status(200).json({ bookings: cachedBookings });
    }

    // Fetch all bookings for the commuter if not in cache
    const bookings = await Booking.find({ commuterId });

    // Manually fetch related details and store in cache
    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const busDetails = await Bus.findOne({ busId: booking.busId });
        const routeDetails = await Route.findOne({ routeId: booking.routeId });

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

    // Cache the bookings for future use
    cacheService.setCache(`bookings_${commuterId}`, bookingsWithDetails);

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

    const busDetails = await Bus.findOne({ busId: booking.busId });
    const routeDetails = await Route.findOne({ routeId: booking.routeId });

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
    const routeId = req.params.routeId;

    // Try to get cached bookings for the route
    const cachedBookings = await cacheService.getCache(
      `bookings_route_${routeId}`
    );
    if (cachedBookings) {
      return res.status(200).json({ bookings: cachedBookings });
    }

    // Fetch bookings by routeId if not cached
    const bookings = await Booking.find({ routeId });

    const bookingsWithDetails = await Promise.all(
      bookings.map(async (booking) => {
        const busDetails = await Bus.findOne({ busId: booking.busId });
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

    // Cache the bookings for future use
    cacheService.setCache(`bookings_route_${routeId}`, bookingsWithDetails);

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

    if (!["available", "booked", "on-hold"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Invalidate the cache for the specific commuter and route
    cacheService.delCache(`bookings_${booking.commuterId}`);
    cacheService.delCache(`bookings_route_${booking.routeId}`);

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

    // Invalidate the cache
    cacheService.delCache(`bookings_${booking.commuterId}`);
    cacheService.delCache(`bookings_route_${booking.routeId}`);

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

    // Invalidate the cache
    cacheService.delCache(`bookings_${booking.commuterId}`);
    cacheService.delCache(`bookings_route_${booking.routeId}`);

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

    // Invalidate the cache
    cacheService.delCache(`bookings_${booking.commuterId}`);
    cacheService.delCache(`bookings_route_${booking.routeId}`);

    res.status(200).json({ message: "Booking restored successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to restore booking", error });
  }
};
