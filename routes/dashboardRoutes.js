const express = require("express");
const router = express.Router();

const {
  getDashboardData,
} = require("../controllers/dashboardController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get(
  "/",
  auth,
  admin,
  getDashboardData
);

module.exports = router;