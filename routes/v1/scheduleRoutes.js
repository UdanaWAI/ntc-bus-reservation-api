const express = require("express");
const {
  createSchedule,
  getAllSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getScheduleByRouteId,
} = require("../../controllers/scheduleController");
const { authenticate, authorize } = require("../../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new schedule (Admin Only)
 *     description: Add a new schedule to the system. This action requires Admin authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeId:
 *                 type: string
 *                 example: "12345"
 *               departureTime:
 *                 type: string
 *                 example: "2024-12-30T08:00:00Z"
 *               arrivalTime:
 *                 type: string
 *                 example: "2024-12-30T12:00:00Z"
 *               busId:
 *                 type: string
 *                 example: "98765"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, authorize("admin"), createSchedule);

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules (Admin/Operator/Commuter)
 *     description: Fetch a list of all schedules in the system.
 *     responses:
 *       200:
 *         description: A list of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   scheduleId:
 *                     type: string
 *                   routeId:
 *                     type: string
 *                   departureTime:
 *                     type: string
 *                   arrivalTime:
 *                     type: string
 *                   busId:
 *                     type: string
 */
router.get("/", authenticate, getAllSchedules);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Get a schedule by ID (Admin/Operator/Commuter)
 *     description: Fetch details of a specific schedule by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule details
 *       404:
 *         description: Schedule not found
 */
router.get("/:id", authenticate, getScheduleById);

/**
 * @swagger
 * /api/schedules/route/{routeId}:
 *   get:
 *     summary: Get a schedule by route ID (Admin/Operator/Commuter)
 *     description: Fetch a list of schedules for a specific route by route ID.
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         description: The route ID for which schedules are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of schedules for the specified route
 *       404:
 *         description: Route not found
 */
router.get("/route/:routeId", getScheduleByRouteId);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a schedule (Admin Only)
 *     description: Update the details of a specific schedule. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeId:
 *                 type: string
 *                 example: "12345"
 *               departureTime:
 *                 type: string
 *                 example: "2024-12-30T08:00:00Z"
 *               arrivalTime:
 *                 type: string
 *                 example: "2024-12-30T12:00:00Z"
 *               busId:
 *                 type: string
 *                 example: "98765"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:id", authenticate, authorize("admin"), updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule (Admin Only)
 *     description: Delete a schedule from the system. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the schedule to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */
router.delete("/:id", authenticate, authorize("admin"), deleteSchedule);

module.exports = router;
