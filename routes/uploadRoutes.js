const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/upload");

const {
  uploadImage,
} = require(
  "../controllers/uploadController"
);

const auth =
  require("../middleware/auth");

const admin =
  require("../middleware/admin");

router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  uploadImage
);

module.exports = router;