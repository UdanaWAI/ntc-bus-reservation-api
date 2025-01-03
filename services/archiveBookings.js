const mongoose = require("mongoose");
const cron = require("node-cron");
const Booking = require("../models/bookingModel");
const connectDB = require("../config/db");

const archiveBookings = async (archConnection) => {
  try {
    console.log("Archiving bookings...");

    // Find bookings older than 2 minutes that haven't been marked as deleted
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const bookingsToArchive = await Booking.find({
      deleted: false,
      createdAt: { $lt: twoMinutesAgo },
    });

    if (bookingsToArchive.length > 0) {
      const archiveBookingModel = archConnection.model(
        "Booking",
        new mongoose.Schema(Booking.schema.obj),
        "bookingArchive"
      );

      // Loop through the bookings and check if they exist in the archive
      for (const booking of bookingsToArchive) {
        const existingBookingInArchive = await archiveBookingModel.findById(
          booking._id
        );

        if (!existingBookingInArchive) {
          // If the booking doesn't exist in the archive, insert it
          await archiveBookingModel.insertMany([booking]);
        } else {
          // If the booking already exists in the archive, remove it from bookings
          await Booking.deleteOne({ _id: booking._id });
        }
      }

      // Soft delete the bookings by updating the 'deleted' field
      await Booking.updateMany(
        { _id: { $in: bookingsToArchive.map((b) => b._id) } },
        { $set: { deleted: true } }
      );

      console.log(
        `Archived and soft-deleted ${bookingsToArchive.length} bookings successfully.`
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
