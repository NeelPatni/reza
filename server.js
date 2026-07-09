const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

console.log("Loading orderRoutes");

const orderRoutes = require("./routes/orderRoutes");

console.log("orderRoutes Loaded");

app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Step 8");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 8 SUCCESS");
});