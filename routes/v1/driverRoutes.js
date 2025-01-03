const express = require("express");
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../../controllers/driverController");
const { authenticate, authorize } = require("../../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver (Admin only)
 *     description: Add a new driver to the system. This action requires Admin authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driverId:
 *                 type: string
 *                 example: "D12345"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               mobile:
 *                 type: string
 *                 example: "0712345678"
 *               licenseNumber:
 *                 type: string
 *                 example: "LN987654"
 *               busId:
 *                 type: string
 *                 example: "B12345"
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, authorize("admin"), createDriver);

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers (Admin only)
 *     description: Fetch a list of all drivers in the system.
 *     responses:
 *       200:
 *         description: A list of drivers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   driverId:
 *                     type: string
 *                     example: "D12345"
 *                   name:
 *                     type: string
 *                     example: "John Doe"
 *                   mobile:
 *                     type: string
 *                     example: "0712345678"
 *                   licenseNumber:
 *                     type: string
 *                     example: "LN987654"
 *                   busId:
 *                     type: string
 *                     example: "B12345"
 */
router.get("/", authenticate, authorize("admin"), getAllDrivers);

/**
 * @swagger
 * /api/drivers/{driverId}:
 *   get:
 *     summary: Get a driver by ID (Admin only)
 *     description: Fetch details of a specific driver by ID. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         description: The ID of the driver.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 driverId:
 *                   type: string
 *                   example: "D12345"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 mobile:
 *                   type: string
 *                   example: "0712345678"
 *                 licenseNumber:
 *                   type: string
 *                   example: "LN987654"
 *                 busId:
 *                   type: string
 *                   example: "B12345"
 *       404:
 *         description: Driver not found
 */
router.get("/:driverId", authenticate, authorize("admin"), getDriverById);

/**
 * @swagger
 * /api/drivers/{driverId}:
 *   put:
 *     summary: Update a driver's details (Admin only)
 *     description: Update the details of a specific driver. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         description: The ID of the driver.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               mobile:
 *                 type: string
 *                 example: "0723456789"
 *               licenseNumber:
 *                 type: string
 *                 example: "LN654321"
 *               busId:
 *                 type: string
 *                 example: "B54321"
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:driverId", authenticate, authorize("admin"), updateDriver);

/**
 * @swagger
 * /api/drivers/{driverId}:
 *   delete:
 *     summary: Delete a driver (Admin only)
 *     description: Delete a driver from the system. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         description: The ID of the driver to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Driver deleted successfully
 *       404:
 *         description: Driver not found
 */
router.delete("/:driverId", authenticate, authorize("admin"), deleteDriver);

module.exports = router;
