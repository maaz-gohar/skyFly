const Flight = require("../models/Flight")

// Get all flights with filtering
exports.getAllFlights = async (query) => {
  const { origin, destination, departureDate, minPrice, maxPrice, airline, limit = 10, page = 1 } = query

  // Build filter object
  const filter = { isActive: true }

  if (origin) filter.origin = new RegExp(origin, "i")
  if (destination) filter.destination = new RegExp(destination, "i")
  if (departureDate) {
    const startDate = new Date(departureDate)
    const endDate = new Date(departureDate)
    endDate.setDate(endDate.getDate() + 1)
    filter.departureTime = { $gte: startDate, $lt: endDate }
  }
  if (minPrice) filter.price = { ...filter.price, $gte: minPrice }
  if (maxPrice) filter.price = { ...filter.price, $lte: maxPrice }
  if (airline) filter.airline = new RegExp(airline, "i")

  // Calculate pagination
  const skip = (page - 1) * limit

  // Execute query
  const flights = await Flight.find(filter).sort({ departureTime: 1 }).skip(skip).limit(Number.parseInt(limit))

  // Get total count
  const total = await Flight.countDocuments(filter)

  return {
    flights,
    pagination: {
      total,
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  }
}

// Get flight by ID
exports.getFlightById = async (id) => {
  return await Flight.findById(id)
}

// Create new flight (admin only)
exports.createFlight = async (flightData) => {
  return await Flight.create(flightData)
}

// Update flight (admin only)
exports.updateFlight = async (id, flightData) => {
  return await Flight.findByIdAndUpdate(id, flightData, {
    new: true,
    runValidators: true,
  })
}

// Delete flight (admin only)
exports.deleteFlight = async (id) => {
  return await Flight.findByIdAndDelete(id)
}
