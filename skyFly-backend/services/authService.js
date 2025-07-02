const User = require("../models/User")
const { generateToken } = require("../utils/jwtUtils")

// Register user
exports.registerUser = async (userData, file) => {
  const { name, email, password, phone, address, city, country, role } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  // Base URL (change to your production URL if deployed)
  const baseUrl = process.env.BASE_URL || "http://192.168.18.164:5000";

  // Handle avatar upload
  const avatarPath = file ? `${baseUrl}/${file.path.replace(/\\/g, "/")}` : `${baseUrl}/uploads/default-avatar.png`;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    city,
    country,
    role: role || "user",
    avatar: avatarPath,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    address: user.address,
    city: user.city,
    country: user.country,
    avatar: user.avatar,
    token: generateToken(user._id),
  };
};

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
    avatar: user.avatar,
    token: generateToken(user._id),
  }
}

// Get user by ID
exports.getUserById = async (userId) => {
  return await User.findById(userId)
}
