const Bus = require("../models/busModel");

// Create a new bus
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ message: "Bus created successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Failed to create bus", error });
  }
};

// Get all buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();

    // Return bus details, including only the ids for the related fields (driverId, conductorId, routeId)
    const busData = buses.map((bus) => ({
      busId: bus.busId,
      driverId: bus.driverId, // Only return driverId as a string (reference)
      conductorId: bus.conductorId, // Only return conductorId as a string (reference)
      routeId: bus.routeId, // Only return routeId as a string (reference)
      NTC: bus.NTC,
      capacity: bus.capacity,
    }));

    res.status(200).json({ buses: busData });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buses", error });
  }
};

// Get a single bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findOne({ busId: req.params.busId });

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    // Return bus details, including only the ids for the related fields (driverId, conductorId, routeId)
    res.status(200).json({
      bus: {
        busId: bus.busId,
        driverId: bus.driverId, // Return driverId as a string
        conductorId: bus.conductorId, // Return conductorId as a string
        routeId: bus.routeId, // Return routeId as a string
        NTC: bus.NTC,
        capacity: bus.capacity,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bus", error });
  }
};

// Update a bus
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findOneAndUpdate(
      { busId: req.params.busId }, // Query by busId
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run on update
      }
    );
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.status(200).json({ message: "Bus updated successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Failed to update bus", error });
  }
};

// Delete a bus
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findOneAndDelete({ busId: req.params.busId });
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }
    res.status(200).json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bus", error });
  }
};
