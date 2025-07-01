const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { protect } = require("../middlewares/authMiddleware")
const upload = require("../middlewares/upload"); 

router.post("/signup", upload.single("avatar"), authController.signup);
router.post("/login", authController.login)

// Protected routes
router.get("/me", protect, authController.getMe)

module.exports = router
