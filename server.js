const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
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
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

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
// Upload Folder
// ======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// Redirect .html -> clean URL
// ======================
app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    return res.redirect(301, req.path.replace(/\.html$/, ""));
  }
  next();
});

// ======================
// Static Files
// ======================
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
    index: false,
  })
);

// ======================
// Home Route
// ======================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Dynamic HTML Pages
// ======================
app.get("/:page", (req, res, next) => {
  const page = req.params.page;

  // Ignore API
  if (page === "api") {
    return next();
  }

  const filePath = path.join(__dirname, "public", `${page}.html`);

  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  next();
});

// ======================
// 404
// ======================
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// ======================
// Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});