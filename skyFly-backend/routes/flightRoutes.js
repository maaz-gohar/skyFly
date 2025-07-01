const express = require("express")
const router = express.Router()
const flightController = require("../controllers/flightController")
const { protect, authorize } = require("../middlewares/authMiddleware")

// Public routes
router.get("/search", flightController.getFilteredFlights)
router.get("/", flightController.getFlights)
router.get("/:id", flightController.getFlight)

// Admin routes
router.post("/", protect, authorize, flightController.createFlight)
router.put("/:id", protect, authorize, flightController.updateFlight)
router.delete("/:id", protect, authorize, flightController.deleteFlight)

module.exports = router
