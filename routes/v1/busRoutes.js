const express = require("express");
const {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
} = require("../../controllers/busController");
const { authenticate, authorize } = require("../../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Create a new bus (Admin/Operator Only)
 *     description: Add a new bus to the system. This action requires Admin or Operator authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               busId:
 *                 type: string
 *                 example: "B12345"
 *               ntcNumber:
 *                 type: string
 *                 example: "NTC67890"
 *               driverId:
 *                 type: string
 *                 example: "D123"
 *               conductorId:
 *                 type: string
 *                 example: "C456"
 *               capacity:
 *                 type: integer
 *                 example: 50
 *               routeId:
 *                 type: string
 *                 example: "R789"
 *     responses:
 *       201:
 *         description: Bus created successfully
 *       400:
 *         description: Bad request
 */

router.post("/", authenticate, authorize("admin", "operator"), createBus);

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses (Admin/Operator/Commuter)
 *     description: Fetch a list of all buses available in the system.
 *     responses:
 *       200:
 *         description: A list of buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   busId:
 *                     type: string
 *                     example: "B12345"
 *                   ntcNumber:
 *                     type: string
 *                     example: "NTC67890"
 *                   driverId:
 *                     type: string
 *                     example: "D123"
 *                   conductorId:
 *                     type: string
 *                     example: "C456"
 *                   capacity:
 *                     type: integer
 *                     example: 50
 *                   routeId:
 *                     type: string
 *                     example: "R789"
 */
router.get("/", authenticate, getAllBuses);

/**
 * @swagger
 * /api/buses/{busId}:
 *   get:
 *     summary: Get a single bus by ID (Admin/Operator/Commuter)
 *     description: Fetch details of a specific bus by its ID.
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         description: The ID of the bus.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 busId:
 *                   type: string
 *                   example: "B12345"
 *                 ntcNumber:
 *                   type: string
 *                   example: "NTC67890"
 *                 driverId:
 *                   type: string
 *                   example: "D123"
 *                 conductorId:
 *                   type: string
 *                   example: "C456"
 *                 capacity:
 *                   type: integer
 *                   example: 50
 *                 routeId:
 *                   type: string
 *                   example: "R789"
 *       404:
 *         description: Bus not found
 */
router.get("/:busId", authenticate, getBusById);

/**
 * @swagger
 * /api/buses/{busId}:
 *   put:
 *     summary: Update a bus (Admin/Operator Only)
 *     description: Update the details of a specific bus. This action requires Admin or Operator authorization.
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         description: The ID of the bus.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ntcNumber:
 *                 type: string
 *                 example: "NTC67890"
 *               driverId:
 *                 type: string
 *                 example: "D123"
 *               conductorId:
 *                 type: string
 *                 example: "C456"
 *               capacity:
 *                 type: integer
 *                 example: 60
 *               routeId:
 *                 type: string
 *                 example: "R789"
 *     responses:
 *       200:
 *         description: Bus updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:busId", authenticate, authorize("admin", "operator"), updateBus);

/**
 * @swagger
 * /api/buses/{busId}:
 *   delete:
 *     summary: Delete a bus (Admin Only)
 *     description: Delete a bus from the system. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: busId
 *         required: true
 *         description: The ID of the bus to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *       404:
 *         description: Bus not found
 */
router.delete("/:busId", authenticate, authorize("admin"), deleteBus);

module.exports = router;
