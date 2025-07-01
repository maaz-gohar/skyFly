const User = require("../models/User");

exports.updateUser = async (userId, updateData) => {
  console.log("UpdateData received:", updateData);

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error("User not found");
  }

  // Optional: fallback/default avatar if updateData.avatar is undefined (can be removed if not needed)
  if (!updateData.avatar) {
    updateData.avatar = userExists.avatar || "https://i.ibb.co/2FxS6Qk/default-avatar.png";
  }

  // Perform update
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  console.log("UserID updated:", userId);
  console.log("Updated User:", updatedUser);

  return updatedUser;
};
