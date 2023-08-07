const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000, () => {
  console.log("Listening to port 3000!!");
});