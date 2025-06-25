const express = require("express")
const router = express.Router()
const flightController = require("../controllers/flightController")
const { protect, authorize } = require("../middlewares/authMiddleware")

// Public routes
router.get("/", flightController.getFlights)
router.get("/:id", flightController.getFlight)

// Admin routes
// router.post("/", protect, authorize("admin"), flightController.createFlight)
// router.put("/:id", protect, authorize("admin"), flightController.updateFlight)
// router.delete("/:id", protect, authorize("admin"), flightController.deleteFlight)

module.exports = router
