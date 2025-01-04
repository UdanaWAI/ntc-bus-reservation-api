const express = require("express");
const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../../controllers/routeController");
const { authenticate, authorize } = require("../../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Route
 *   description: Route management operations (Admin Only for Create, Update, and Delete)
 */

/**
 * @swagger
 * /api/v1/routes:
 *   post:
 *     summary: Create a new route (Admin Only)
 *     description: Add a new route to the system. Requires Admin authorization.
 *     tags: [Route]
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
 *               startLocation:
 *                 type: string
 *                 example: "Colombo"
 *               endLocation:
 *                 type: string
 *                 example: "Kandy"
 *               distance:
 *                 type: number
 *                 example: 115
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, authorize("admin"), createRoute);

/**
 * @swagger
 * /api/v1/routes:
 *   get:
 *     summary: Get all routes (Admin/Operator/Commuter)
 *     description: Fetch a list of all routes in the system.
 *     tags: [Route]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of routes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   routeId:
 *                     type: string
 *                     example: "R12345"
 *                   startLocation:
 *                     type: string
 *                     example: "Colombo"
 *                   endLocation:
 *                     type: string
 *                     example: "Kandy"
 *                   distance:
 *                     type: number
 *                     example: 115
 */
router.get("/", authenticate, getAllRoutes);

/**
 * @swagger
 * /api/v1/routes/{routeId}:
 *   get:
 *     summary: Get a route by ID (Admin/Operator/Commuter)
 *     description: Retrieve details of a specific route by its ID.
 *     tags: [Route]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         description: The ID of the route.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 routeId:
 *                   type: string
 *                   example: "R12345"
 *                 startLocation:
 *                   type: string
 *                   example: "Colombo"
 *                 endLocation:
 *                   type: string
 *                   example: "Kandy"
 *                 distance:
 *                   type: number
 *                   example: 115
 *       404:
 *         description: Route not found
 */
router.get("/:routeId", authenticate, getRouteById);

/**
 * @swagger
 * /api/v1/routes/{routeId}:
 *   put:
 *     summary: Update a route (Admin Only)
 *     description: Modify the details of a specific route. Requires Admin authorization.
 *     tags: [Route]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         description: The ID of the route.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startLocation:
 *                 type: string
 *                 example: "Galle"
 *               endLocation:
 *                 type: string
 *                 example: "Matara"
 *               distance:
 *                 type: number
 *                 example: 40
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:routeId", authenticate, authorize("admin"), updateRoute);

/**
 * @swagger
 * /api/v1/routes/{routeId}:
 *   delete:
 *     summary: Delete a route (Admin Only)
 *     description: Remove a route from the system. Requires Admin authorization.
 *     tags: [Route]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         description: The ID of the route to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route deleted successfully
 *       404:
 *         description: Route not found
 */
router.delete("/:routeId", authenticate, authorize("admin"), deleteRoute);

module.exports = router;
