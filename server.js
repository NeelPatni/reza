const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs"); // ✅ UPDATED: Added for checking HTML file existence
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
  res.sendFile(path.join(__dirname, "public", "index"));
});

// ======================
// ✅ UPDATED: Redirect .html URLs to clean URLs
// Example:
// /about.html  -> /about
// /index.html  -> /index
// ======================
app.get("/:page.html", (req, res) => {
  return res.redirect(301, `/${req.params.page}`);
});

// ======================
// ✅ UPDATED: Handle Clean URLs
// Example:
// /about   -> about.html
// /contact -> contact.html
// /index   -> index.html
// ======================
app.get("/:page", (req, res, next) => {
  const page = req.params.page;

  // Skip API requests
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
// 404 Page
// ======================
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index"));
});

// ======================
// Server
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});