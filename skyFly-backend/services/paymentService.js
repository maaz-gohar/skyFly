const Payment = require("../models/Payment")
const Booking = require("../models/Booking")

// Process payment
exports.processPayment = async (paymentData) => {
  const { bookingId, amount, paymentMethod } = paymentData

  // Check if booking exists
  const booking = await Booking.findById(bookingId)
  if (!booking) {
    throw new Error("Booking not found")
  }

  // Check if payment amount matches booking amount
  if (amount !== booking.totalAmount) {
    throw new Error("Payment amount does not match booking amount")
  }

  // Generate transaction ID
  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`

  // Create payment
  const payment = await Payment.create({
    bookingId,
    amount,
    paymentMethod,
    paymentStatus: "Completed",
    transactionId,
  })

  // Update booking status
  await Booking.findByIdAndUpdate(bookingId, { status: "Confirmed" })

  return payment
}

// Get payment by ID
exports.getPaymentById = async (id) => {
  return await Payment.findById(id).populate("bookingId")
}

// Get payments by booking ID
exports.getPaymentsByBookingId = async (bookingId) => {
  return await Payment.find({ bookingId })
}

// Refund payment
exports.refundPayment = async (id) => {
  const payment = await Payment.findById(id)
  if (!payment) {
    throw new Error("Payment not found")
  }

  if (payment.paymentStatus === "Refunded") {
    throw new Error("Payment is already refunded")
  }

  // Update payment status
  payment.paymentStatus = "Refunded"
  await payment.save()

  // Update booking status
  await Booking.findByIdAndUpdate(payment.bookingId, { status: "Cancelled" })

  return payment
}
