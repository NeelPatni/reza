const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Step 1 Working ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ STEP 1 SUCCESS");
});