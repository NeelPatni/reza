require("dotenv").config();

console.log("========== SERVER START ==========");

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:");
  console.error(err);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("1. Express Loaded");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("2. ✅ MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

try {
  console.log("3. Loading authRoutes");
  const authRoutes = require("./routes/authRoutes");
  console.log("4. authRoutes Loaded");
  app.use("/api/auth", authRoutes);
} catch (err) {
  console.error("authRoutes ERROR");
  console.error(err);
}

try {
  console.log("5. Loading UserRoutes");
  const userRoutes = require("./routes/UserRoutes");
  console.log("6. UserRoutes Loaded");
  app.use("/api/users", userRoutes);
} catch (err) {
  console.error("UserRoutes ERROR");
  console.error(err);
}

try {
  console.log("7. Loading productRoutes");
  const productRoutes = require("./routes/productRoutes");
  console.log("8. productRoutes Loaded");
  app.use("/api/products", productRoutes);
} catch (err) {
  console.error("productRoutes ERROR");
  console.error(err);
}

try {
  console.log("9. Loading categoryRoutes");
  const categoryRoutes = require("./routes/categoryRoutes");
  console.log("10. categoryRoutes Loaded");
  app.use("/api/categories", categoryRoutes);
} catch (err) {
  console.error("categoryRoutes ERROR");
  console.error(err);
}

try {
  console.log("11. Loading orderRoutes");
  const orderRoutes = require("./routes/orderRoutes");
  console.log("12. orderRoutes Loaded");
  app.use("/api/orders", orderRoutes);
} catch (err) {
  console.error("orderRoutes ERROR");
  console.error(err);
}

try {
  console.log("13. Loading dashboardRoutes");
  const dashboardRoutes = require("./routes/dashboardRoutes");
  console.log("14. dashboardRoutes Loaded");
  app.use("/api/dashboard", dashboardRoutes);
} catch (err) {
  console.error("dashboardRoutes ERROR");
  console.error(err);
}

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`15. ✅ Server Running On Port ${PORT}`);
});

console.log("========== SERVER END ==========");