const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  blockUser,
  unblockUser,
  deleteUser,
} = require("../controllers/userController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get All Users
router.get(
  "/",
  auth,
  admin,
  getAllUsers
);

// Get Single User
router.get(
  "/:id",
  auth,
  admin,
  getSingleUser
);

// Update User Role
router.put(
  "/:id/role",
  auth,
  admin,
  updateUserRole
);

// Block User
router.put(
  "/:id/block",
  auth,
  admin,
  blockUser
);

// Unblock User
router.put(
  "/:id/unblock",
  auth,
  admin,
  unblockUser
);

// Delete User
router.delete(
  "/:id",
  auth,
  admin,
  deleteUser
);

module.exports = router;