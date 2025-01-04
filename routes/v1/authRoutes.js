const express = require("express");
const {
  validateUserRegistration,
  validateUserLogin,
} = require("../../middlewares/validationMiddleware");
const { register, login } = require("../../controllers/authController");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User login and registration management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Register a new user by providing their name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request (e.g., missing or invalid fields).
 *       500:
 *         description: Internal server error.
 */

router.post("/register", validateUserRegistration, register);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     description: Authenticate a user and return a JWT token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
 *       400:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

router.post("/login", validateUserLogin, login);

module.exports = router;
