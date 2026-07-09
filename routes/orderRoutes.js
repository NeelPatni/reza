const express = require("express");

const router = express.Router();

const auth =
  require("../middleware/auth");

const admin =
  require("../middleware/admin");

const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
} = require(
  "../controllers/orderController"
);


// Customer Create Order
router.post(
  "/",
  createOrder
);


// Admin Get All Orders
router.get(
  "/",
  getAllOrders
);


// Admin Get Single Order
router.get(
  "/:id",
  getSingleOrder
);


// Admin Update Status
router.put(
  "/:id/status",
  updateOrderStatus
);


// Admin Delete Order
router.delete(
  "/:id",
  deleteOrder
);

module.exports = router;