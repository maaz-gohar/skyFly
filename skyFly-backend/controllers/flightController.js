const { check } = require("express-validator");
const flightService = require("../services/flightService");
const asyncHandler = require("../utils/asyncHandler");
const { validate } = require("../middlewares/validationMiddleware");
const Flight = require("../models/Flight") 

// Validation helper
const isCustomDateFormat = (value) => {
  const regex = /^\d{1,2}-\d{1,2}-\d{4}( \d{1,2}:\d{2})?$/;
  if (!regex.test(value)) {
    throw new Error("Invalid date format. Use 'DD-MM-YYYY' or 'DD-MM-YYYY HH:mm'");
  }
  return true;
};

// ✅ Controller: Create flight
const createFlight = [
  check("flightNumber", "Flight number is required").notEmpty(),
  check("airline", "Airline is required").notEmpty(),
  check("origin", "Origin is required").notEmpty(),
  check("destination", "Destination is required").notEmpty(),
  check("departureTime", "Valid departure time is required").custom(isCustomDateFormat),
  check("arrivalTime", "Valid arrival time is required").custom(isCustomDateFormat),
  check("price", "Price must be a positive number").isFloat({ min: 0 }),
  check("availableSeats", "Available seats must be a positive number").isInt({ min: 0 }),
  validate,
  asyncHandler(async (req, res) => {
    const flight = await flightService.createFlight(req.body);
    res.status(201).json({ success: true, data: flight });
  }),
];

// ✅ Controller: Update flight
const updateFlight = asyncHandler(async (req, res) => {
  const flight = await flightService.updateFlight(req.params.id, req.body);
  if (!flight) {
    return res.status(404).json({ success: false, message: "Flight not found" });
  }
  res.status(200).json({ success: true, data: flight });
});

// ✅ Controller: Delete flight
const deleteFlight = asyncHandler(async (req, res) => {
  const flight = await flightService.deleteFlight(req.params.id);
  if (!flight) {
    return res.status(404).json({ success: false, message: "Flight not found" });
  }
  res.status(200).json({ success: true, data: {} });
});

// ✅ Controller: Get all flights
const getFlights = asyncHandler(async (req, res) => {
  const result = await flightService.getAllFlights(req.query);
  res.status(200).json({
    success: true,
    pagination: result.pagination,
    data: result.flights,
  });
});

const getFilteredFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, class: flightClass, passengers } = req.query;

    const filter = {};

    if (origin) filter.origin = { $regex: new RegExp(origin, "i") };
    if (destination) filter.destination = { $regex: new RegExp(destination, "i") };

    if (departureDate) {
      // ✳️ Fix here: use ISO date comparison instead of regex on date string
      const date = new Date(departureDate);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1); // 1 day range

      filter.departureTime = {
        $gte: date.toISOString(),
        $lt: nextDate.toISOString(),
      };
    }

    if (flightClass) filter.class = { $regex: new RegExp(flightClass, "i") };

    if (passengers) filter.availableSeats = { $gte: parseInt(passengers) };

    const flights = await Flight.find(filter);
    res.status(200).json(flights);
  } catch (error) {
    console.error("❌ getFilteredFlights error:", error); // This will show actual issue in terminal
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// ✅ Controller: Get single flight
const getFlight = asyncHandler(async (req, res) => {
  const flight = await flightService.getFlightById(req.params.id);
  if (!flight) {
    return res.status(404).json({ success: false, message: "Flight not found" });
  }
  res.status(200).json({ success: true, data: flight });
});

// ✅ Export all
module.exports = {
  getFilteredFlights,
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
};
