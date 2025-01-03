const nodemailer = require("nodemailer");
const qr = require("qr-image");
const User = require("../models/userModel");

// Set up email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Example using Gmail
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Email sending middleware
const sendBookingEmail = async (req, res, next) => {
  try {
    const { commuterId, busId, routeId, seatNumbers, bookings } = req.body;

    // Generate the QR code for the booking
    const qrData = {
      commuterId,
      busId,
      routeId,
      seatNumbers,
      bookings: bookings.map((booking) => ({
        seatNumber: booking.seatNumber,
        status: booking.status,
      })),
    };

    const qrCodeImage = qr.imageSync(JSON.stringify(qrData), { type: "png" });
    const qrCodeBase64 = qrCodeImage.toString("base64"); // Generate a base64 QR code

    // Verify if the QR code is generated correctly
    if (!qrCodeImage || qrCodeImage.length === 0) {
      console.error("QR code generation failed");
      return res.status(500).json({ message: "QR code generation failed" });
    }

    // Get the commuter's email
    const user = await User.findById(commuterId);
    if (!user || !user.email) {
      return res.status(400).json({ message: "Commuter email not found" });
    }

    // Send the email with the QR code
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email
      to: user.email, // The commuter's email
      subject: "Your Booking Confirmation and QR Code",
      text: `Dear commuter, your booking has been confirmed. Please find your booking QR code below.`,
      html: `
        <p>Dear commuter,</p>
        <p>Your booking has been confirmed. Please find your booking QR code below:</p>
        <img src="data:image/png;base64,${qrCodeBase64}" alt="Booking QR Code" />
        <p>Thank you for using our service!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message || error });
  }
};

module.exports = { sendBookingEmail };
