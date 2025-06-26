const { check } = require("express-validator")
const bookingService = require("../services/bookingService")
const asyncHandler = require("../utils/asyncHandler")
const { validate } = require("../middlewares/validationMiddleware")

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = [
  // Validation
  check("flightId", "Flight ID is required").isMongoId(),
  check("passengers", "At least one passenger is required").isInt({ min: 1 }),
  // check("passengers.*.name", "Passenger name is required").notEmpty(),
  // check("passengers.*.age", "Passenger age must be a positive number").isInt({
  //   min: 0,
  // }),
  // check("passengers.*.gender", "Passenger gender is required").isIn(["Male", "Female", "Other"]),
  check("contactEmail", "Valid contact email is required").isEmail(),
  check("contactPhone", "Contact phone is required").notEmpty(),
  validate,

  // Controller
  asyncHandler(async (req, res) => {
    // Add user ID to booking data
    const bookingData = {
      ...req.body,
      userId: req.user._id,
    }

    const booking = await bookingService.createBooking(bookingData)

    res.status(201).json({
      success: true,
      data: booking,
    })
  }),
]

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id)

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    })
  }

  // Check if booking belongs to user or user is admin
  if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this booking",
    })
  }

  res.status(200).json({
    success: true,
    data: booking,
  })
})

// @desc    Get user bookings
// @route   GET /api/users/:id/bookings
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res) => {
  // Check if user is accessing their own bookings or is admin
  if (req.params.id !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access these bookings",
    })
  }

  const bookings = await bookingService.getUserBookings(req.params.id)

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  })
})

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id)

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    })
  }

  // Check if booking belongs to user or user is admin
  if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to cancel this booking",
    })
  }

  const cancelledBooking = await bookingService.cancelBooking(req.params.id)

  res.status(200).json({
    success: true,
    data: cancelledBooking,
  })
})
