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
 * tags:
 *   name: Schedule
 *   description: Schedule management operations (Admin Only for Create, Update, and Delete)
 */

/**
 * @swagger
 * /api/v1/schedules:
 *   post:
 *     summary: Create a new schedule (Admin Only)
 *     description: Add a new schedule to the system. This action requires Admin authorization.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routeId:
 *                 type: string
 *                 example: "R12345"
 *               busId:
 *                 type: string
 *                 example: "B67890"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-05T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-05T12:00:00Z"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-05"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, authorize("admin"), createSchedule);

/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     summary: Get all schedules (Admin/Operator/Commuter)
 *     description: Fetch a list of all schedules in the system.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
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
 *                   busId:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   date:
 *                     type: string
 *                     format: date
 */
router.get("/", authenticate, getAllSchedules);

/**
 * @swagger
 * /api/v1/schedules/{id}:
 *   get:
 *     summary: Get a schedule by ID (Admin/Operator/Commuter)
 *     description: Fetch details of a specific schedule by ID.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 scheduleId:
 *                   type: string
 *                 routeId:
 *                   type: string
 *                 busId:
 *                   type: string
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                 endTime:
 *                   type: string
 *                   format: date-time
 *                 date:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Schedule not found
 */
router.get("/:id", authenticate, getScheduleById);

/**
 * @swagger
 * /api/v1/schedules/route/{routeId}:
 *   get:
 *     summary: Get schedules by route ID (Admin/Operator/Commuter)
 *     description: Fetch a list of schedules for a specific route by route ID.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
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
router.get("/route/:routeId", authenticate, getScheduleByRouteId);

/**
 * @swagger
 * /api/v1/schedules/{id}:
 *   put:
 *     summary: Update a schedule (Admin Only)
 *     description: Update the details of a specific schedule. This action requires Admin authorization.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
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
 *                 example: "R12345"
 *               busId:
 *                 type: string
 *                 example: "B67890"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-05T08:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-05T12:00:00Z"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-05"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:id", authenticate, authorize("admin"), updateSchedule);

/**
 * @swagger
 * /api/v1/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule (Admin Only)
 *     description: Delete a schedule from the system. This action requires Admin authorization.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * /api/v1/schedules:
 *   get:
 *     summary: Get all schedules with optional filters (Admin/Operator/Commuter)
 *     description: Fetch a list of all schedules in the system. You can filter schedules using query parameters.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: routeId
 *         required: false
 *         description: Filter schedules by route ID.
 *         schema:
 *           type: string
 *       - in: query
 *         name: busId
 *         required: false
 *         description: Filter schedules by bus ID.
 *         schema:
 *           type: string
 *       - in: query
 *         name: startTime
 *         required: false
 *         description: Filter schedules by start time.
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endTime
 *         required: false
 *         description: Filter schedules by end time.
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: date
 *         required: false
 *         description: Filter schedules by date.
 *         schema:
 *           type: string
 *           format: date
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
 *                   busId:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   date:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Invalid query parameters
 */
router.get("/", authenticate, async (req, res) => {
  try {
    const { routeId, busId, startTime, endTime, date } = req.query;

    // Build the filter object dynamically
    const filter = {};
    if (routeId) filter.routeId = routeId;
    if (busId) filter.busId = busId;
    if (startTime) filter.startTime = { $gte: new Date(startTime) };
    if (endTime) filter.endTime = { $lte: new Date(endTime) };
    if (date) filter.date = date;

    // Fetch schedules with the filter
    const schedules = await Schedule.find(filter);

    // For each schedule, fetch the corresponding route and bus details
    const schedulesWithDetails = await Promise.all(
      schedules.map(async (schedule) => {
        const routeDetails = await Route.findOne({ routeId: schedule.routeId });
        const busDetails = await Bus.findOne({ busId: schedule.busId });

        return {
          ...schedule.toObject(),
          route: routeDetails
            ? {
                startLocation: routeDetails.startLocation,
                endLocation: routeDetails.endLocation,
              }
            : null,
          bus: busDetails
            ? {
                ntcNumber: busDetails.ntcNumber,
                capacity: busDetails.capacity,
              }
            : null,
        };
      })
    );

    res.status(200).json({ schedules: schedulesWithDetails });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules", error });
  }
});
