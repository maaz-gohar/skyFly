const express = require("express")
const router = express.Router()
const bookingController = require("../controllers/bookingController")
const userController = require("../controllers/userController")
const { protect } = require("../middlewares/authMiddleware")

// Protected routes
router.get("/:id/bookings",protect, bookingController.getUserBookings)
router.put("/update-user/:id", userController.updateUserController)

module.exports = router
