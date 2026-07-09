const User = require("../models/User");


// ======================================
// Get All Users
// ======================================
exports.getAllUsers = async (
  req,
  res
) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get Single User
// ======================================
exports.getSingleUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// ======================================
// Update User Role
// ======================================
exports.updateUserRole =
  async (req, res) => {
    try {
      const { role } =
        req.body;

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User Not Found",
        });
      }

      user.role = role;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Role Updated Successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ======================================
// Block User
// ======================================
exports.blockUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User Not Found",
      });
    }

    user.isBlocked = true;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "User Blocked Successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};


// ======================================
// Unblock User
// ======================================
exports.unblockUser =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User Not Found",
        });
      }

      user.isBlocked = false;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "User Unblocked Successfully",
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ======================================
// Delete User
// ======================================
exports.deleteUser = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User Not Found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};