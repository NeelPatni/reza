const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getDashboardData = async (req, res) => {
  try {
    // ======================
    // Dashboard Cards
    // ======================
    const totalUsers =
      await User.countDocuments();

    const totalProducts =
      await Product.countDocuments();

    const totalOrders =
      await Order.countDocuments();

    // ======================
    // Revenue
    // ======================
    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // ======================
    // Recent Orders
    // ======================
    const recentOrders =
      await Order.find()
        .populate("user", "name")
        .sort({
          createdAt: -1,
        })
        .limit(5);

    // ======================
    // ALL Products
    // ======================
    const products =
      await Product.find()
        .populate(
          "category",
          "name"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Dashboard data fetch failed",
    });
  }
};