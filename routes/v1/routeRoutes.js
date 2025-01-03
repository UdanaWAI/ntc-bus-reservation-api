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
 * /api/routes:
 *   post:
 *     summary: Create a new route (Admin Only)
 *     description: Add a new route to the system. This action requires Admin authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *                 example: "New York"
 *               destination:
 *                 type: string
 *                 example: "Boston"
 *               distance:
 *                 type: integer
 *                 example: 215
 *               duration:
 *                 type: string
 *                 example: "4 hours"
 *     responses:
 *       201:
 *         description: Route created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", authenticate, authorize("admin"), createRoute);

/**
 * @swagger
 * /api/routes:
 *   get:
 *     summary: Get all routes (Admin/Operator/Commuter)
 *     description: Fetch a list of all routes in the system.
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
 *                   origin:
 *                     type: string
 *                   destination:
 *                     type: string
 *                   distance:
 *                     type: integer
 *                   duration:
 *                     type: string
 */
router.get("/", authenticate, getAllRoutes);

/**
 * @swagger
 * /api/routes/{routeId}:
 *   get:
 *     summary: Get a route by ID (Admin/Operator/Commuter)
 *     description: Fetch details of a specific route by ID.
 *     parameters:
 *       - in: path
 *         name: routeId
 *         required: true
 *         description: The ID of the route.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Route details
 *       404:
 *         description: Route not found
 */
router.get("/:routeId", authenticate, getRouteById);

/**
 * @swagger
 * /api/routes/{routeId}:
 *   put:
 *     summary: Update a route (Admin Only)
 *     description: Update the details of a specific route. This action requires Admin authorization.
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
 *               origin:
 *                 type: string
 *                 example: "New York"
 *               destination:
 *                 type: string
 *                 example: "Boston"
 *               distance:
 *                 type: integer
 *                 example: 215
 *               duration:
 *                 type: string
 *                 example: "4 hours"
 *     responses:
 *       200:
 *         description: Route updated successfully
 *       400:
 *         description: Bad request
 */
router.put("/:routeId", authenticate, authorize("admin"), updateRoute);

/**
 * @swagger
 * /api/routes/{routeId}:
 *   delete:
 *     summary: Delete a route (Admin Only)
 *     description: Delete a route from the system. This action requires Admin authorization.
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
