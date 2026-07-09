const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

console.log("Loading dashboardRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

console.log("dashboardRoutes Loaded");

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Step 9");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 9 SUCCESS");
});