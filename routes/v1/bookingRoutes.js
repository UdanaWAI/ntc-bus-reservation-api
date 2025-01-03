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
 *               seatNumber:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [5, 6]
 *               routeId:
 *                 type: string
 *                 example: "xyz456"
 *               busId:
 *                 type: string
 *                 example: "bus123"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "63aef5c8b9d57b001c2b1234"
 *                 seatNumber:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [5, 6]
 *                 status:
 *                   type: string
 *                   example: "booked"
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
 *               seatNumber:
 *                 type: number
 *                 example: 5
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
 *                   seatNumber:
 *                     type: array
 *                     items:
 *                       type: number
 *                   routeId:
 *                     type: string
 *                   status:
 *                     type: string
 *       404:
 *         description: No bookings found
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
 *                 enum: ["available", "booked", "on-hold", "cancelled"]
 *                 example: "booked"
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

/**
 * @swagger
 * /api/bookings/{id}/soft-delete:
 *   patch:
 *     summary: Soft delete a booking (Admin only)
 *     description: Mark a booking as deleted without permanently removing it.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking soft-deleted successfully
 *       404:
 *         description: Booking not found
 */
router.patch(
  "/:id/soft-delete",
  authenticate,
  authorize("admin"),
  softDeleteBooking
);

/**
 * @swagger
 * /api/bookings/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted booking (Admin only)
 *     description: Restore a previously soft-deleted booking.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the booking.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking restored successfully
 *       404:
 *         description: Booking not found
 */
router.patch("/:id/restore", authenticate, authorize("admin"), restoreBooking);

module.exports = router;
