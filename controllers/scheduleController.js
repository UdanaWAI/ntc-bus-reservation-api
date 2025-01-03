const Schedule = require("../models/scheduleModel");
const Bus = require("../models/busModel");
const Route = require("../models/routeModel");
const { getCache, setCache } = require("../services/cacheService");

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {
    const { routeId, busId, startTime, endTime, date } = req.body;

    // Check if bus and route exist (using string IDs)
    const bus = await Bus.findOne({ busId: busId });
    if (!bus) {
      return res.status(400).json({ message: "Bus not found" });
    }

    const route = await Route.findOne({ routeId: routeId });
    if (!route) {
      return res.status(400).json({ message: "Route not found" });
    }

    // Create a new schedule
    const schedule = await Schedule.create({
      routeId,
      busId,
      startTime,
      endTime,
      date,
    });

    // Invalidate the cache for related schedule data (optional)
    setCache(`schedule_${schedule._id}`, schedule);
    setCache(`schedule_route_${routeId}`, schedule);

    res
      .status(201)
      .json({ message: "Schedule created successfully", schedule });
  } catch (error) {
    res.status(500).json({ message: "Failed to create schedule", error });
  }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    // Cache key for all schedules
    const cacheKey = "all_schedules";

    // Try to get the cached schedules
    const cachedSchedules = getCache(cacheKey);
    if (cachedSchedules) {
      return res.status(200).json({ schedules: cachedSchedules });
    }

    const schedules = await Schedule.find();

    // For each schedule, fetch the corresponding route and bus details
    const schedulesWithDetails = await Promise.all(
      schedules.map(async (schedule) => {
        const routeDetails = await Route.findOne({ routeId: schedule.routeId });
        const busDetails = await Bus.findOne({ busId: schedule.busId });

        // Return the schedule with route and bus details
        return {
          ...schedule.toObject(),
          route: routeDetails
            ? {
                startLocation: routeDetails.startLocation,
                endLocation: routeDetails.endLocation,
              }
            : null,
          bus: busDetails
            ? {
                ntcNumber: busDetails.ntcNumber,
                capacity: busDetails.capacity,
              }
            : null,
        };
      })
    );

    // Cache the schedules for future requests
    setCache(cacheKey, schedulesWithDetails);

    res.status(200).json({ schedules: schedulesWithDetails });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedules", error });
  }
};

// Get a schedule by ID
exports.getScheduleById = async (req, res) => {
  try {
    const scheduleId = req.params.id;

    // Check cache first
    const cachedSchedule = getCache(`schedule_${scheduleId}`);
    if (cachedSchedule) {
      return res.status(200).json({ schedule: cachedSchedule });
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Fetch the corresponding route and bus details
    const routeDetails = await Route.findOne({ routeId: schedule.routeId });
    const busDetails = await Bus.findOne({ busId: schedule.busId });

    const scheduleWithDetails = {
      ...schedule.toObject(),
      route: routeDetails
        ? {
            startLocation: routeDetails.startLocation,
            endLocation: routeDetails.endLocation,
          }
        : null,
      bus: busDetails
        ? {
            ntcNumber: busDetails.ntcNumber,
            capacity: busDetails.capacity,
          }
        : null,
    };

    // Cache the schedule data for future requests
    setCache(`schedule_${scheduleId}`, scheduleWithDetails);

    res.status(200).json({ schedule: scheduleWithDetails });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch schedule", error });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { routeId, busId, startTime, endTime, date } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { routeId, busId, startTime, endTime, date },
      { new: true, runValidators: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Invalidate the cache for this schedule
    setCache(`schedule_${schedule._id}`, schedule);
    setCache(`schedule_route_${routeId}`, schedule);

    res
      .status(200)
      .json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    res.status(500).json({ message: "Failed to update schedule", error });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Remove the cache for this schedule
    setCache(`schedule_${schedule._id}`, null);
    setCache(`schedule_route_${schedule.routeId}`, null);

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete schedule", error });
  }
};

// Get a schedule by routeId
exports.getScheduleByRouteId = async (req, res) => {
  try {
    const routeId = req.params.routeId;

    // Try to get the cached schedule by routeId
    const cachedSchedule = getCache(`schedule_route_${routeId}`);
    if (cachedSchedule) {
      return res.status(200).json({ schedule: cachedSchedule });
    }

    const schedule = await Schedule.findOne({ routeId });

    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Schedule not found for the provided routeId" });
    }

    // Fetch the corresponding route and bus details
    const routeDetails = await Route.findOne({ routeId: schedule.routeId });
    const busDetails = await Bus.findOne({ busId: schedule.busId });

    const scheduleWithDetails = {
      ...schedule.toObject(),
      route: routeDetails
        ? {
            startLocation: routeDetails.startLocation,
            endLocation: routeDetails.endLocation,
          }
        : null,
      bus: busDetails
        ? {
            ntcNumber: busDetails.ntcNumber,
            capacity: busDetails.capacity,
          }
        : null,
    };

    // Cache the schedule data by routeId
    setCache(`schedule_route_${routeId}`, scheduleWithDetails);

    res.status(200).json({ schedule: scheduleWithDetails });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch schedule by routeId", error });
  }
};
