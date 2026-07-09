const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    // Category Name
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // URL Friendly Name
    // Example:
    // Electronics -> electronics
    // Men's Fashion -> mens-fashion
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    // Category Image
    image: {
      type: String,
      default: "",
    },

    // Active / Inactive
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Category",
  categorySchema
);