const { validationResult } = require("express-validator");
const Driver = require("../models/driverModel");
const Bus = require("../models/busModel");
const { validateCommonFields } = require("../middlewares/validationMiddleware"); // Import validation middleware

// Create a new driver
exports.createDriver = [
  // Apply common validation middleware for name, mobile, licenseNumber, and busId
  ...validateCommonFields,

  // Handler function
  async (req, res) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { driverId, name, mobile, licenseNumber, busId } = req.body;

      // Check if the bus exists
      const bus = await Bus.findOne({ busId: busId });
      if (!bus) {
        return res.status(400).json({ message: "Bus not found" });
      }

      // Create a new driver
      const driver = new Driver({
        driverId,
        name,
        mobile,
        licenseNumber,
        busId,
      });

      await driver.save();
      res.status(201).json({ message: "Driver created successfully", driver });
    } catch (error) {
      res.status(500).json({ message: "Failed to create driver", error });
    }
  },
];

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find();

    // Return driver details, including busId as a string
    const driverData = drivers.map((driver) => ({
      driverId: driver.driverId,
      name: driver.name,
      mobile: driver.mobile,
      licenseNumber: driver.licenseNumber,
      busId: driver.busId, // Return busId as a string
    }));

    res.status(200).json({ drivers: driverData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch drivers", error });
  }
};

// Get a driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findOne({
      driverId: req.params.driverId,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Return driver details with busId as a string
    res.status(200).json({
      driver: {
        driverId: driver.driverId,
        name: driver.name,
        mobile: driver.mobile,
        licenseNumber: driver.licenseNumber,
        busId: driver.busId, // busId as string
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch driver", error });
  }
};

// Update a driver's details
exports.updateDriver = [
  // Apply common validation middleware for name, mobile, licenseNumber, and busId
  ...validateCommonFields,

  // Handler function
  async (req, res) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, mobile, licenseNumber, busId } = req.body;

      // Check if the bus exists
      const bus = await Bus.findOne({ busId: busId });
      if (!bus) {
        return res.status(400).json({ message: "Bus not found" });
      }

      // Update the driver
      const driver = await Driver.findOneAndUpdate(
        { driverId: req.params.driverId },
        {
          name,
          mobile,
          licenseNumber,
          busId,
        },
        { new: true }
      );

      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }

      res.status(200).json({
        message: "Driver updated successfully",
        driver: {
          driverId: driver.driverId,
          name: driver.name,
          mobile: driver.mobile,
          licenseNumber: driver.licenseNumber,
          busId: driver.busId, // busId as string
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update driver", error });
    }
  },
];

// Delete a driver
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({
      driverId: req.params.driverId,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete driver", error });
  }
};
