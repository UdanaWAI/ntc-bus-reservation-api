const express = require("express");
const {
  createConductor,
  getAllConductors,
  getConductorById,
  updateConductor,
  deleteConductor,
} = require("../../controllers/conductorController");
const { authenticate, authorize } = require("../../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/conductors:
 *   post:
 *     summary: Create a new conductor (Admin only)
 *     description: Add a new conductor to the system. This action requires Admin authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conductorId:
 *                 type: string
 *                 example: "C12345"
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
 *         description: Conductor created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, authorize("admin"), createConductor);

/**
 * @swagger
 * /api/conductors:
 *   get:
 *     summary: Get all conductors (Admin only)
 *     description: Fetch a list of all conductors in the system.
 *     responses:
 *       200:
 *         description: A list of conductors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   conductorId:
 *                     type: string
 *                     example: "C12345"
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
router.get("/", authenticate, authorize("admin"), getAllConductors);

/**
 * @swagger
 * /api/conductors/{conductorId}:
 *   get:
 *     summary: Get a conductor by ID (Admin only)
 *     description: Fetch details of a specific conductor by ID. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: conductorId
 *         required: true
 *         description: The ID of the conductor.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conductor details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conductorId:
 *                   type: string
 *                   example: "C12345"
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
 *         description: Conductor not found
 */
router.get("/:conductorId", authenticate, authorize("admin"), getConductorById);

/**
 * @swagger
 * /api/conductors/{conductorId}:
 *   put:
 *     summary: Update a conductor's details (Admin only)
 *     description: Update the details of a specific conductor. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: conductorId
 *         required: true
 *         description: The ID of the conductor.
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
 *                 example: "Jane Smith"
 *               mobile:
 *                 type: string
 *                 example: "0723456789"
 *               licenseNumber:
 *                 type: string
 *                 example: "LN123456"
 *               busId:
 *                 type: string
 *                 example: "B54321"
 *     responses:
 *       200:
 *         description: Conductor updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:conductorId", authenticate, authorize("admin"), updateConductor);

/**
 * @swagger
 * /api/conductors/{conductorId}:
 *   delete:
 *     summary: Delete a conductor (Admin only)
 *     description: Delete a conductor from the system. This action requires Admin authorization.
 *     parameters:
 *       - in: path
 *         name: conductorId
 *         required: true
 *         description: The ID of the conductor to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conductor deleted successfully
 *       404:
 *         description: Conductor not found
 */
router.delete(
  "/:conductorId",
  authenticate,
  authorize("admin"),
  deleteConductor
);

module.exports = router;
