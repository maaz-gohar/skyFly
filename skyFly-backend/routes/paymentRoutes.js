const express = require("express")
const router = express.Router()
const paymentController = require("../controllers/paymentController")
const { protect } = require("../middlewares/authMiddleware")

// Protected routes
router.post("/", protect, paymentController.processPayment)
router.get("/:id", protect, paymentController.getPayment)

module.exports = router
