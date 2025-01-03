const Route = require("../models/routeModel");

// Create a new route
exports.createRoute = async (req, res) => {
  try {
    const { routeId, startLocation, endLocation, distance } = req.body;

    const route = await Route.create({
      routeId,
      startLocation,
      endLocation,
      distance,
    });
    res.status(201).json({ message: "Route created successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Failed to create route", error });
  }
};

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json({ routes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch routes", error });
  }
};

// Get a single route by ID
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.routeId });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.status(200).json({ route });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch route", error });
  }
};

// Update a route
exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findOneAndUpdate(
      { routeId: req.params.routeId }, // Query by routeId
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run on update
      }
    );
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.status(200).json({ message: "Route updated successfully", route });
  } catch (error) {
    res.status(500).json({ message: "Failed to update route", error });
  }
};

// Delete a route
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findOneAndDelete({ routeId: req.params.routeId });
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }
    res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete route", error });
  }
};
