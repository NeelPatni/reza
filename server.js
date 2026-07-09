const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

console.log("Loading productRoutes");

const productRoutes = require("./routes/productRoutes");

console.log("productRoutes Loaded");

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Step 6");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 6 SUCCESS");
});