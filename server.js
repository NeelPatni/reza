const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

console.log("Loading UserRoutes");

const userRoutes = require("./routes/UserRoutes");

console.log("UserRoutes Loaded");

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Step 5");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("STEP 5 SUCCESS");
});