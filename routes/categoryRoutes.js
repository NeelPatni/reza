const express = require("express");

const router = express.Router();

const {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getCategoriesWithProducts,
} = require("../controllers/categoryController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const upload = require("../middleware/upload");


// ============================
// CREATE CATEGORY
// ============================
router.post(
  "/",
  auth,
  admin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createCategory
);

// ============================
// CATEGORY + PRODUCTS (IMPORTANT FIRST)
// ============================
router.get("/categories-with-products", getCategoriesWithProducts);

// ============================
// GET ALL CATEGORIES
// ============================
router.get("/", getCategories);

// ============================
// GET SINGLE CATEGORY
// ============================
router.get("/:id", getSingleCategory);

// ============================
// UPDATE CATEGORY
// ============================
router.put(
  "/:id",
  auth,
  admin,
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateCategory
);

// ============================
// DELETE CATEGORY
// ============================
router.delete("/:id", auth, admin, deleteCategory);

module.exports = router;