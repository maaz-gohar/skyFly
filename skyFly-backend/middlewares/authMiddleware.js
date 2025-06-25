const jwt = require("jsonwebtoken")
const User = require("../models/User")
const asyncHandler = require("../utils/asyncHandler")

// Protect routes - verify JWT token
const auth = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        })
      }

      // Check if user is active
      if (req.user.isActive === false) {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        })
      }

      next()
    } catch (error) {
      console.error("Token verification error:", error)
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      })
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    })
  }
})

// Admin middleware - check if user is admin
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized as admin",
    })
  }
})

// Optional auth - doesn't require token but sets user if present
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select("-password")
    } catch (error) {
      // Token is invalid, but we continue without user
      req.user = null
    }
  }

  next()
})

// Check if user owns resource or is admin
const ownerOrAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user._id.toString() === req.params.userId)) {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this resource",
    })
  }
})

module.exports = {
  auth,
  admin,
  optionalAuth,
  ownerOrAdmin,
  // Legacy exports for backward compatibility
  protect: auth,
  authorize: admin,
}
