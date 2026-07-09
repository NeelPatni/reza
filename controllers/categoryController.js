const Category = require("../models/Category");
const Product = require("../models/Product");
const cloudinary = require("cloudinary").v2;

// ============================
// CREATE CATEGORY
// ============================
exports.createCategory = async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name required",
      });
    }

    // slug
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    // duplicate check
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    let image = "";

    // upload image (multer)
    if (req.files && req.files.image) {
      const file = req.files.image[0];

      const base64 =
        `data:${file.mimetype};base64,` +
        file.buffer.toString("base64");

      const result = await cloudinary.uploader.upload(base64, {
        folder: "categories",
        resource_type: "auto",
      });

      image = result.secure_url;
    }

    const category = await Category.create({
      name,
      slug,
      image,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Category Created",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET ALL CATEGORIES
// ============================
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// GET SINGLE CATEGORY
// ============================
exports.getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// UPDATE CATEGORY
// ============================
exports.updateCategory = async (req, res) => {
  try {
    const { name, status } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let image = category.image;

    // new image upload
    if (req.files && req.files.image) {
      const file = req.files.image[0];

      const base64 =
        `data:${file.mimetype};base64,` +
        file.buffer.toString("base64");

      const result = await cloudinary.uploader.upload(base64, {
        folder: "categories",
        resource_type: "auto",
      });

      image = result.secure_url;
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        slug,
        image,
        status,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Category Updated",
      category: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// DELETE CATEGORY
// ============================
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// CATEGORY + PRODUCTS
// ============================

exports.getCategoriesWithProducts = async (req, res) => {
  try {

    const categories = await Category.find({ status: "active" });

    const data = await Promise.all(
      categories.map(async (cat) => {

        const products = await Product.find({
          category: cat._id,   // ✅ CORRECT (ObjectId match)
          status: "active"
        })
        .limit(6); // homepage optimization

        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image,
          products
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};