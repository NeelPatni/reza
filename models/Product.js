const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      trim: true,
      default: "",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    sizes: [
      {
        size: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],

    stock: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      default: "",
    },

    // Main Image / Video
    mainImage: {
      type: String,
      default: "",
    },

    mainImageType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    // Gallery
    subImages: [
      {
        url: {
          type: String,
        },

        type: {
          type: String,
          enum: ["image", "video"],
          default: "image",
        },
      },
    ],

    // Product Video
    productVideo: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

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
  "Product",
  productSchema
);