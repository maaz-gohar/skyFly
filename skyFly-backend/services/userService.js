const User = require("../models/User");

exports.updateUser = async (userId, updateData) => {
  console.log("UpdateData:", updateData);
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  console.log("UserID:", userId);
  console.log("Update Data:", updateData);
  return updatedUser;
};

