const { validationResult } = require("express-validator");
const Conductor = require("../models/conductorModel");
const Bus = require("../models/busModel");
const { validateCommonFields } = require("../middlewares/validationMiddleware"); // Import the common validation middleware

// Create a new conductor
exports.createConductor = [
  // Apply common validation middleware
  ...validateCommonFields,

  // Handler function
  async (req, res) => {
    const errors = validationResult(req); // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { conductorId, name, mobile, licenseNumber, busId } = req.body;

      // Check if the bus exists
      const bus = await Bus.findOne({ busId: busId });
      if (!bus) {
        return res.status(400).json({ message: "Bus not found" });
      }

      // Create the conductor
      const conductor = new Conductor({
        conductorId,
        name,
        mobile,
        licenseNumber,
        busId,
      });
      await conductor.save();
      res
        .status(201)
        .json({ message: "Conductor created successfully", conductor });
    } catch (error) {
      res.status(500).json({ message: "Failed to create conductor", error });
    }
  },
];

// Get all conductors
exports.getAllConductors = async (req, res) => {
  try {
    const conductors = await Conductor.find();

    // Return conductor details, including busId as a string
    const conductorData = conductors.map((conductor) => ({
      conductorId: conductor.conductorId,
      name: conductor.name,
      mobile: conductor.mobile,
      licenseNumber: conductor.licenseNumber,
      busId: conductor.busId, // Directly return busId as a string
    }));

    res.status(200).json({ conductors: conductorData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conductors", error });
  }
};

// Get a conductor by ID
exports.getConductorById = async (req, res) => {
  try {
    const conductor = await Conductor.findOne({
      conductorId: req.params.conductorId,
    });

    if (!conductor) {
      return res.status(404).json({ message: "Conductor not found" });
    }

    // Return the conductor and busId as a string
    res.status(200).json({
      conductor: {
        conductorId: conductor.conductorId,
        name: conductor.name,
        mobile: conductor.mobile,
        licenseNumber: conductor.licenseNumber,
        busId: conductor.busId, // busId as string
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch conductor", error });
  }
};

// Update a conductor's details
exports.updateConductor = [
  // Apply common validation middleware
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

      // Update the conductor's details
      const conductor = await Conductor.findOneAndUpdate(
        { conductorId: req.params.conductorId },
        {
          name,
          mobile,
          licenseNumber,
          busId,
        },
        { new: true }
      );

      if (!conductor) {
        return res.status(404).json({ message: "Conductor not found" });
      }

      res.status(200).json({
        message: "Conductor updated successfully",
        conductor: {
          conductorId: conductor.conductorId,
          name: conductor.name,
          mobile: conductor.mobile,
          licenseNumber: conductor.licenseNumber,
          busId: conductor.busId, // busId as string
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update conductor", error });
    }
  },
];

// Delete a conductor
exports.deleteConductor = async (req, res) => {
  try {
    const conductor = await Conductor.findOneAndDelete({
      conductorId: req.params.conductorId,
    });

    if (!conductor) {
      return res.status(404).json({ message: "Conductor not found" });
    }

    res.status(200).json({ message: "Conductor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete conductor", error });
  }
};
