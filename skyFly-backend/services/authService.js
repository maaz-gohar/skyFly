const User = require("../models/User")
const { generateToken } = require("../utils/jwtUtils")

// Register user
exports.registerUser = async (userData) => {
  const { name, email, password, phone , role} = userData

  // Check if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error("User already exists")
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "user", // Default to 'user' if no role is provided
  })

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  }
}

// Login user
exports.loginUser = async (email, password) => {
  // Find user by email
  const user = await User.findOne({ email }).select("+password")

  // Check if user exists and password matches
  if (!user || !(await user.matchPassword(password))) {
    throw new Error("Invalid email or password")
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  }
}

// Get user by ID
exports.getUserById = async (userId) => {
  return await User.findById(userId)
}
