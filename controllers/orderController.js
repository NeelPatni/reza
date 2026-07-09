const Order = require("../models/Order");

// =========================================
// Create New Order
// =========================================
exports.createOrder = async (req, res) => {
  try {

    // Generate Order Number
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });

    let orderNumber = "ORD000001";

    if (lastOrder && lastOrder.orderNumber) {

      const lastNumber = parseInt(
        lastOrder.orderNumber.replace("ORD", "")
      );

      orderNumber =
        "ORD" + String(lastNumber + 1).padStart(6, "0");
    }

    req.body.orderNumber = orderNumber;

    const order = await Order.create(req.body);

    res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================================
// Get All Orders
// =========================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate(
        "orderItems.product",
        "name price mainImage"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// Get Single Order
// =========================================
exports.getSingleOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email phone"
      )
      .populate(
        "orderItems.product",
        "name price mainImage"
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =========================================
// Update Order Status
// =========================================
exports.updateOrderStatus =
  async (req, res) => {
    try {
      const { orderStatus } =
        req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message:
            "Order Not Found",
        });
      }

      order.orderStatus =
        orderStatus;

      await order.save();

      res.status(200).json({
        success: true,
        message:
          "Order Status Updated",
        order,
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


// =========================================
// Delete Order (Optional)
// =========================================
exports.deleteOrder = async (
  req,
  res
) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Order Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};