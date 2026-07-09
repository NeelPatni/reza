const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("dns");

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Database Connection
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

// ======================
// API Routes
// ======================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ======================
// Static Files
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// ======================
// Frontend Routes
// ======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Handle HTML Pages
// ======================
app.get("/:page", (req, res, next) => {
  const file = path.join(__dirname, "public", req.params.page);

  if (file.endsWith(".html")) {
    return res.sendFile(file, (err) => {
      if (err) next();
    });
  }

  next();
});

// ======================
// 404 Page
// ======================
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// ======================
// Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});