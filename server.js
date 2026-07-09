const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

console.log("Loading authRoutes...");

const authRoutes = require("./routes/authRoutes");

console.log("authRoutes Loaded");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Step 4");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 4 SUCCESS");
});