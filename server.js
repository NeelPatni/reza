const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

console.log("Loading categoryRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

console.log("categoryRoutes Loaded");

app.use("/api/categories", categoryRoutes);

app.get("/", (req, res) => {
  res.send("Step 7");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 7 SUCCESS");
});