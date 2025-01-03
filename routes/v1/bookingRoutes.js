const express = require("express");
const {
  createBooking,
  getBookingsByCommuter,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  holdSeatForUser,
  getBookingsByRouteId,
  softDeleteBooking,
  restoreBooking,
} = require("../../controllers/bookingController");
const { authenticate, authorize } = require("../../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking (Commuter only)
 *     description: Create a new booking for a commuter. This action requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatId:
 *                 type: string
 *                 example: "abc123"
 *               routeId:
 *                 type: string
 *                 example: "xyz456"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, createBooking);

/**
 * @swagger
 * /api/bookings/hold:
 *   post:
 *     summary: Hold a seat for a commuter (Commuter only)
 *     description: Hold a seat for a commuter. This action requires authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatId:
 *                 type: string
 *                 example: "abc123"
 *               routeId:
 *                 type: string
 *                 example: "xyz456"
 *     responses:
 *       200:
 *         description: Seat held successfully
 *       400:
 *         description: Bad request
 */
router.post("/hold", authenticate, holdSeatForUser);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for a commuter (Commuter only)
 *     description: Fetch all bookings for the authenticated commuter.
 *     responses:
 *       200:
 *         description: A list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   seatId:
 *                     type: string
 *                   routeId:
 *                     type: string
 */
router.get("/", authenticate, getBookingsByCommuter);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a single booking by ID (Admin/Commuter)
 *     description: Fetch details of a specific booking by ID. This is available to both Admin and Commuter.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 */
router.get("/:id", authenticate, getBookingById);

/**
 * @swagger
 * /api/bookings/route/{routeId}:
 *   get:
 *     summary: Get bookings by routeId (Admin/Commuter)
 *     description: Fetch all bookings associated with a specific route.
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         description: The route ID to fetch bookings.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of bookings for the route
 *       404:
 *         description: No bookings found for this route
 */
router.get("/route/:routeId", authenticate, getBookingsByRouteId);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Update a booking's status (Admin only)
 *     description: Update the status of a booking. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "confirmed"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Bad request
 */
router.put(
  "/:id/status",
  authenticate,
  authorize("admin"),
  updateBookingStatus
);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking (Commuter only)
 *     description: Cancel an existing booking. This action requires authentication.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking canceled successfully
 *       404:
 *         description: Booking not found
 */
router.put("/:id/cancel", authenticate, cancelBooking);

// Route for soft deleting a booking (Admin only)
router.patch(
  "/:id/soft-delete",
  authenticate,
  authorize("admin"),
  softDeleteBooking
);

// Route for restoring a soft-deleted booking (Admin only)
router.patch("/:id/restore", authenticate, authorize("admin"), restoreBooking);

module.exports = router;
