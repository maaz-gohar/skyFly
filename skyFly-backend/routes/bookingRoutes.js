const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController")
const paymentController = require("../controllers/paymentController")
const { protect } = require("../middlewares/authMiddleware")

// Protected routes
router.post("/", protect, bookingController.createBooking)
router.get("/:id", protect, bookingController.getBooking)
router.put("/:id/cancel", protect, bookingController.cancelBooking)

// Payment routes related to bookings
router.get("/:id/payments", paymentController.getBookingPayments)

module.exports = router
