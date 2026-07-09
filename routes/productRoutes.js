const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  getProductBySlug,
  deleteProduct,
} = require("../controllers/productController");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

// =======================
// CREATE PRODUCT
// =======================
router.post(
  "/",
  auth,
  admin,
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 4,
    },
    {
      name: "productVideo",
      maxCount: 1,
    },
  ]),
  createProduct
);

// =======================
// GET ALL PRODUCTS
// =======================
router.get(
  "/",
  getProducts
);

// =======================
// GET SINGLE PRODUCT
// =======================
router.get(
  "/:id",
  getSingleProduct
);

// =======================
// GET PRODUCT Slug
// =======================

router.get(
  "/slug/:slug",
  getProductBySlug
);

// =======================
// UPDATE PRODUCT
// =======================
router.put(
  "/:id",
  auth,
  admin,
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "subImages",
      maxCount: 4,
    },
    {
      name: "productVideo",
      maxCount: 1,
    },
  ]),
  updateProduct
);

// =======================
// DELETE PRODUCT
// =======================
router.delete(
  "/:id",
  auth,
  admin,
  deleteProduct
);

module.exports = router;