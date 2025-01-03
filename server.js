const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const cron = require("node-cron");
const { checkSeatExpiry } = require("./services/bookingService");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./docs/swaggerDefinition");

// Import the archive function (this will automatically execute the archiving logic)
require("./services/archiveBookings");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Swagger setup
const options = {
  swaggerDefinition,
  apis: ["./routes/v1/*.js"], // Path to your routes folder
};

const swaggerSpec = swaggerJsdoc(options);

// API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Secure HTTP headers

// Connect to MongoDB (active + archived databases)
connectDB(); // This will connect both active and archive databases

// Placeholder route
app.get("/", (req, res) => {
  res.send("NTC API is running...");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Import routes
const authRoutes = require("./routes/v1/authRoutes");
const busRoutes = require("./routes/v1/busRoutes");
const routeRoutes = require("./routes/v1/routeRoutes");
const scheduleRoutes = require("./routes/v1/scheduleRoutes");
const bookingRoutes = require("./routes/v1/bookingRoutes");
const driverRoutes = require("./routes/v1/driverRoutes");
const conductorRoutes = require("./routes/v1/conductorRoutes");

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/buses", busRoutes);
app.use("/api/v1/routes", routeRoutes);
app.use("/api/v1/schedules", scheduleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/drivers", driverRoutes);
app.use("/api/v1/conductors", conductorRoutes);

// 404 Handler
app.use("/*", (req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// Run the checkSeatExpiry function every minute (uncomment this if needed)
/*cron.schedule("* * * * *", () => {
  console.log("Checking for expired seats...");
  checkSeatExpiry();
});
*/
