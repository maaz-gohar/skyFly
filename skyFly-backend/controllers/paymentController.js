const { check } = require("express-validator")
const paymentService = require("../services/paymentService")
const bookingService = require("../services/bookingService")
const asyncHandler = require("../utils/asyncHandler")
const { validate, validatePayment } = require("../middlewares/validationMiddleware")

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.processPayment = [
  ...validatePayment, // ✅ Validation middleware

  asyncHandler(async (req, res) => {
    const booking = await bookingService.getBookingById(req.body.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to make payment for this booking",
      });
    }

    const payment = await paymentService.processPayment(req.body);

    res.status(201).json({
      success: true,
      data: payment,
    });
  }),
];

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id)

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    })
  }

  // Check if payment belongs to user's booking or user is admin
  const booking = await bookingService.getBookingById(payment.bookingId)

  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this payment",
    })
  }

  res.status(200).json({
    success: true,
    data: payment,
  })
})

// @desc    Get payments by booking ID
// @route   GET /api/bookings/:id/payments
// @access  Private
exports.getBookingPayments = asyncHandler(async (req, res) => {
  // Check if booking belongs to user
  const booking = await bookingService.getBookingById(req.params.id)

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    })
  }

  if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access payments for this booking",
    })
  }

  const payments = await paymentService.getPaymentsByBookingId(req.params.id)

  res.status(200).json({
    success: true,
    count: payments.length,
    data: payments,
  })
})
