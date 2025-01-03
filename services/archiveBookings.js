const mongoose = require("mongoose");
const cron = require("node-cron");
const Booking = require("../models/bookingModel");
const connectDB = require("../config/db");

const archiveBookings = async (archConnection) => {
  try {
    console.log("Archiving bookings...");
    const bookingsToArchive = await Booking.find({ deleted: true });

    if (bookingsToArchive.length > 0) {
      const archiveBookingModel = archConnection.model(
        "Booking",
        new mongoose.Schema(Booking.schema.obj),
        "bookingArchive"
      );
      await archiveBookingModel.insertMany(bookingsToArchive);
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      await Booking.deleteMany({
        _id: { $in: bookingsToArchive.map((b) => b._id) },
        createdAt: { $lt: twoMinutesAgo },
      });

      console.log(
        `Archived ${bookingsToArchive.length} bookings successfully.`
      );
    } else {
      console.log("No bookings to archive.");
    }
  } catch (error) {
    console.error("Error archiving bookings:", error);
  }
};

cron.schedule("*/2 * * * *", async () => {
  console.log("Running the archive bookings task...");
  const archConnection = await connectDB();
  archiveBookings(archConnection);
});
