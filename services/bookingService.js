const Booking = require("../models/bookingModel");

/**
 * Puts a seat on hold for a specified commuter.
 * @param {string} commuterId - ID of the commuter.
 * @param {string} busId - ID of the bus.
 * @param {string} routeId - ID of the route.
 * @param {number[]} seatNumber - Seat number to hold.
 * @returns {Promise<Object>} - The booking object.
 */
const holdSeat = async (commuterId, busId, routeId, seatNumber) => {
  // Check if the seat is already booked or on-hold
  const existingBooking = await Booking.findOne({
    busId,
    seatNumber,
    status: { $in: ["booked", "on-hold"] },
  });

  if (existingBooking) {
    throw new Error("Seat is already booked or on-hold.");
  }

  // Create a new booking with the status 'on-hold'
  const booking = new Booking({
    commuterId,
    busId,
    routeId,
    seatNumber,
    status: "on-hold",
  });

  await booking.save();

  // Schedule the seat to expire in 12 minutes
  setTimeout(async () => {
    const currentBooking = await Booking.findOne({
      _id: booking._id,
      status: "on-hold",
    });

    if (currentBooking) {
      currentBooking.status = "available";
      await currentBooking.save();
    }
  }, 12 * 60 * 1000); // 12 minutes in milliseconds

  return booking;
};

module.exports = {
  holdSeat,
};
