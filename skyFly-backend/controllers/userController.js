const userService = require("../services/userService");
const asyncHandler = require("../utils/asyncHandler");

exports.updateUserController = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  console.log("userId:", userId);
  console.log("UpdateData:", updatedData);

  const updatedUser = await userService.updateUser(userId, updatedData);

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found or update failed",
    });
  }

  res.status(200).json({
    success: true,
    data: updatedUser,
  });
});
