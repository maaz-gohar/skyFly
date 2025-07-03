const express = require("express")
const router = express.Router()
const {
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
  updateUserRole,
} = require("../controllers/adminController")
const { protect, admin } = require("../middlewares/authMiddleware")
const { validateFlight, validateBookingStatus, validatePaymentStatus } = require("../middlewares/validationMiddleware")

// Apply admin middleware to all routes
router.use(protect, admin)

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats)

// Flight management routes
router.route("/flights").get(getAllFlights).post(validateFlight, createFlight)

router.route("/flights/:id").put(validateFlight, updateFlight).delete(deleteFlight)

// User management routes
router.get("/users", getAllUsers)
router.patch("/users/:id/status", updateUserStatus)
router.patch("/users/:id/role", updateUserRole)
router.delete("/users/:id", deleteUser)

// Booking management routes
router.get("/bookings", getAllBookings)
router.patch("/bookings/:id/status", validateBookingStatus, updateBookingStatus)

// Payment management routes
router.get("/payments", getAllPayments)
router.post("/payments/:id/refund", processRefund)

module.exports = router
