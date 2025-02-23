const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from /");
});

app.use("/test", () => {
  res.send("hello from test");
});

app.listen(3000, () => {
  console.log("server started");
});
