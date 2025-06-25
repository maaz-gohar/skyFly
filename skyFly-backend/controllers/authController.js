const { check } = require("express-validator")
const authService = require("../services/authService")
const asyncHandler = require("../utils/asyncHandler")
const { validate } = require("../middlewares/validationMiddleware")

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = [
  // Validation
  check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  check("phone", "Phone number is required").notEmpty(),
  validate,

  // Controller
  asyncHandler(async (req, res) => {
    const userData = await authService.registerUser(req.body)

    res.status(201).json({
      success: true,
      data: userData,
    })
  }),
]

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = [
  // Validation
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
  validate,

  // Controller
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const userData = await authService.loginUser(email, password)

    res.status(200).json({
      success: true,
      data: userData,
    })
  }),
]

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id)

  res.status(200).json({
    success: true,
    data: user,
  })
})
