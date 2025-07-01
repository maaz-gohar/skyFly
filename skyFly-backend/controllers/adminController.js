const asyncHandler = require("../utils/asyncHandler")
const User = require("../models/User")
const Flight = require("../models/Flight")
const Booking = require("../models/Booking")
const Payment = require("../models/Payment")

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments()
  const totalFlights = await Flight.countDocuments()
  const totalBookings = await Booking.countDocuments()
  const activeUsers = await User.countDocuments({ isActive: true })

  // Calculate total revenue
  const revenueResult = await Payment.aggregate([
    { $match: { status: "Completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ])
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

  // Get monthly revenue for the last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: "Completed",
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ])

  // Get booking status distribution
  const bookingStats = await Booking.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ])

  // Get recent bookings
  const recentBookings = await Booking.find()
    .populate("userId", "name email")
    .populate("flightId", "flightNumber airline origin destination departureTime")
    .sort({ createdAt: -1 })
    .limit(5)

  // 🔥 Get active flights: flights with at least one Confirmed or Pending booking
  const activeFlightIds = await Booking.distinct("flightId", {
    status: { $in: ["Confirmed", "Pending"] },
  })
  const activeFlights = activeFlightIds.length

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalFlights,
      totalBookings,
      activeUsers,
      totalRevenue,
      monthlyRevenue,
      bookingStats,
      recentBookings,
      activeFlights, // 👈 now added
    },
  })
})

// @desc    Get all flights
// @route   GET /api/admin/flights
// @access  Private/Admin
const getAllFlights = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const flights = await Flight.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

  const total = await Flight.countDocuments()

  res.status(200).json({
    success: true,
    data: {
      flights,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    },
  })
})

// @desc    Create new flight
// @route   POST /api/admin/flights
// @access  Private/Admin
const createFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.create(req.body)

  res.status(201).json({
    success: true,
    message: "Flight created successfully",
    data: { flight },
  })
})

// @desc    Update flight
// @route   PUT /api/admin/flights/:id
// @access  Private/Admin
const updateFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!flight) {
    return res.status(404).json({
      success: false,
      message: "Flight not found",
    })
  }

  res.status(200).json({
    success: true,
    message: "Flight updated successfully",
    data: { flight },
  })
})

// @desc    Delete flight
// @route   DELETE /api/admin/flights/:id
// @access  Private/Admin
const deleteFlight = asyncHandler(async (req, res) => {
  const flight = await Flight.findById(req.params.id)

  if (!flight) {
    return res.status(404).json({
      success: false,
      message: "Flight not found",
    })
  }

  // Check if flight has bookings
  const bookingCount = await Booking.countDocuments({ flight: req.params.id })
  if (bookingCount > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete flight with existing bookings",
    })
  }

  await Flight.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: "Flight deleted successfully",
  })
})

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const users = await User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit)

  const total = await User.countDocuments()

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    },
  })
})

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const newStatus = isActive ? "active" : "inactive";

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: newStatus },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: `User ${newStatus} successfully`,
    data: user,
  });
});



// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    })
  }

  // Check if user has active bookings
  const activeBookings = await Booking.countDocuments({
    user: req.params.id,
    status: { $in: ["Confirmed", "Pending"] },
  })

  if (activeBookings > 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete user with active bookings",
    })
  }

  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  })
})

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const bookings = await Booking.find()
    .populate("userId", "name email phone")
    .populate("flightId", "flightNumber airline origin destination departureTime")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Booking.countDocuments()

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    },
  })
})

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })
    .populate("userId", "name email")
    .populate("flightId", "flightNumber airline")

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    })
  }

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: { booking },
  })
})

// @desc    Get all payments
// @route   GET /api/admin/payments
// @access  Private/Admin
const getAllPayments = asyncHandler(async (req, res) => {
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  const payments = await Payment.find()
    .populate({
      path: "bookingId",
      populate: {
        path: "userId flightId",
        select: "name email flightNumber airline",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await Payment.countDocuments()

  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    },
  })
})

// @desc    Process refund
// @route   POST /api/admin/payments/:id/refund
// @access  Private/Admin
const processRefund = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    })
  }

  if (payment.paymentStatus !== "Completed") {
    return res.status(400).json({
      success: false,
      message: "Can only refund completed payments",
    })
  }

  payment.status = "Refunded"
  payment.refundedAt = new Date()
  await payment.save()

  // Update associated booking status
  await Booking.findByIdAndUpdate(payment.booking, { status: "Cancelled" })

  res.status(200).json({
    success: true,
    message: "Refund processed successfully",
    data: { payment },
  })
})

module.exports = {
  getDashboardStats,
  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  getAllPayments,
  processRefund,
}
