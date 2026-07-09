const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend Working 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Started on", PORT);
});