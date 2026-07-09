const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("cloudinary").v2;


// ===================================
// CREATE PRODUCT
// ===================================
exports.createProduct = async (
  req,
  res
) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const {
      sku,
      name,
      category,
      price,
      salePrice,
      description,
      featured,
      status,
    } = req.body;

    const sizes = JSON.parse(
      req.body.sizes || "[]"
    );

   let mainImage = "";
let mainImageType = "";

if (req.files && req.files.mainImage) {
  const file = req.files.mainImage[0];

  const base64 =
    `data:${file.mimetype};base64,` +
    file.buffer.toString("base64");

  const result =
    await cloudinary.uploader.upload(
      base64,
      {
        folder: "products",
        resource_type: "auto",
      }
    );

  mainImage = result.secure_url;
  mainImageType = result.resource_type; // image or video
}

  let subImages = [];

if (req.files && req.files.subImages) {
  for (const file of req.files.subImages) {
    const base64 =
      `data:${file.mimetype};base64,` +
      file.buffer.toString("base64");

    const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder: "products",
          resource_type: "auto",
        }
      );

    subImages.push({
      url: result.secure_url,
      type: result.resource_type,
    });
  }
}

    const categoryExists =
      await Category.findById(
        category
      );

    if (
      !categoryExists
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Category not found",
      });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    let totalStock = 0;

    if (sizes.length > 0) {
      totalStock =
        sizes.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.quantity
            ),
          0
        );
    }

    let discountPercentage = 0;

    if (
      Number(price) > 0 &&
      Number(salePrice) > 0
    ) {
      discountPercentage =
        Math.round(
          ((Number(
            price
          ) -
            Number(
              salePrice
            )) /
            Number(
              price
            )) *
            100
        );
    }

    const product = await Product.create({
  sku,
  name,
  slug,
  category,
  price,
  salePrice,
  discountPercentage,
  sizes,
  stock: totalStock,
  description,
  mainImage,
  mainImageType,
  subImages,
  featured: featured === "true",
  status,
});

    res.status(201).json({
      success: true,
      message:
        "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ===================================
// GET ALL PRODUCTS
// ===================================
exports.getProducts = async (req, res) => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const {
      keyword,
      category,
      status,
      featured,
      lowStock,
    } = req.query;

    const filter = {};

    // Search by product name
    if (keyword) {
      filter.name = {
        $regex: keyword,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by featured
    if (featured !== undefined) {
      filter.featured =
        featured === "true";
    }

    // Low stock products
    if (lowStock === "true") {
      filter.stock = {
        $lte: 5,
      };
    }

    const totalProducts =
      await Product.countDocuments(
        filter
      );

    const products =
      await Product.find(filter)
        .populate(
          "category",
          "name"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      totalProducts,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// GET SINGLE PRODUCT
// ===================================
exports.getSingleProduct =
  async (req, res) => {
    try {
      const product =
        await Product.findById(
          req.params.id
        ).populate("category");

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };



// ===================================
// UPDATE PRODUCT
// ===================================
exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const {
      sku,
      name,
      category,
      price,
      salePrice,
      description,
      featured,
      status,
    } = req.body;

    let sizes = [];

    if (req.body.sizes) {
      sizes = JSON.parse(req.body.sizes);
    }

    const existingProduct = await Product.findById(
      req.params.id
    );

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Existing Images
    // Existing Images

let mainImage = existingProduct.mainImage;

let mainImageType =
  existingProduct.mainImageType || "image";

let subImages =
  existingProduct.subImages || [];


// Upload Main Image

if (req.files && req.files.mainImage) {

    const file = req.files.mainImage[0];

    const base64 =
        `data:${file.mimetype};base64,` +
        file.buffer.toString("base64");

    const result =
        await cloudinary.uploader.upload(base64, {
            folder: "products",
            resource_type: "auto",
        });

    mainImage = result.secure_url;

    mainImageType = result.resource_type;
}



// Upload Gallery Images

if (req.files && req.files.subImages) {

    subImages = [];

    for (const file of req.files.subImages) {

        const base64 =
            `data:${file.mimetype};base64,` +
            file.buffer.toString("base64");

        const result =
            await cloudinary.uploader.upload(base64, {
                folder: "products",
                resource_type: "auto",
            });

        subImages.push({
            url: result.secure_url,
            type: result.resource_type,
        });

    }

}

    // Slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    // Stock
    let totalStock = 0;

    if (sizes.length > 0) {
      totalStock = sizes.reduce(
        (total, item) =>
          total +
          Number(item.quantity),
        0
      );
    }

    // Discount
    let discountPercentage = 0;

    if (
      Number(price) > 0 &&
      Number(salePrice) > 0
    ) {
      discountPercentage =
        Math.round(
          ((Number(price) -
            Number(salePrice)) /
            Number(price)) *
            100
        );
    }

   const product =
await Product.findByIdAndUpdate(
req.params.id,
{
    sku,
    name,
    slug,
    category,
    price,
    salePrice,
    discountPercentage,
    sizes,
    stock: totalStock,
    description,

    mainImage,
    mainImageType,
    subImages,

    featured: featured === "true",
    status,
},
{
    new: true,
}
);
    res.status(200).json({
      success: true,
      message:
        "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===================================
// DELETE PRODUCT
// ===================================
exports.deleteProduct =
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Product Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  // ===================================
// GET PRODUCT BY SLUG
// ===================================

exports.getProductBySlug = async (req, res) => {

  try {

    const product = await Product.findOne({
      slug: req.params.slug,
      status: "active"
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};