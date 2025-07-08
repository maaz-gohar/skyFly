const User = require("../models/User")
const { generateToken } = require("../utils/jwtUtils")

// Register user
// exports.registerUser = async (userData, file) => {
//   const { name, email, password, phone, address, city, country, role } = userData;

//   // Check if user already exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     throw new Error("User already exists");
//   }

//   // Base URL (change to your production URL if deployed)
//   const baseUrl = process.env.BASE_URL || "http://192.168.18.164:5000";

//   // Handle avatar upload
//   const avatarPath = file ? `${baseUrl}/${file.path.replace(/\\/g, "/")}` : `${baseUrl}/uploads/default-avatar.png`;

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password,
//     phone,
//     address,
//     city,
//     country,
//     role: role || "user",
//     avatar: avatarPath,
//   });

//   return {
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     role: user.role,
//     address: user.address,
//     city: user.city,
//     country: user.country,
//     avatar: user.avatar,
//     token: generateToken(user._id),
//   };
// };

// const User = require("../models/User");
// const { generateToken } = require("../utils/jwtUtils");

exports.registerUser = async (userData, file) => {
  const {
    name,
    email,
    password,
    phone,
    address,
    city,
    country,
    role,
    provider, // "google" or "facebook"
    providerId, // Google's/Facebook's user id
    avatar: socialAvatar, // Profile picture URL from social provider
  } = userData;

  let user = await User.findOne({ email });

  if (user) {
    // If provider login and user exists, log them in
    if (provider && user.provider === provider && user.providerId === providerId) {
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
    }

    // Email already registered manually
    if (!provider) {
      throw new Error("User already exists");
    }

    throw new Error("Email already registered with another method");
  }

  // Base URL (change for production)
  const baseUrl = process.env.BASE_URL || "http://192.168.18.164:5000";
  let avatarPath;

  // Choose avatar from:
  // 1. Social provider
  // 2. Uploaded file
  // 3. Default
  if (socialAvatar) {
    avatarPath = socialAvatar;
  } else if (file) {
    avatarPath = `${baseUrl}/${file.path.replace(/\\/g, "/")}`;
  } else {
    avatarPath = `${baseUrl}/uploads/default-avatar.png`;
  }

  // Create new user
  user = await User.create({
    name,
    email,
    password: password || undefined, // password not required for social login
    phone,
    address,
    city,
    country,
    role: role || "user",
    avatar: avatarPath,
    provider: provider || "local",
    providerId: providerId || null,
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
