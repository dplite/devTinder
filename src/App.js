const express = require("express");
require("./config/Database");
const User = require("./models/User");

const { connectDB } = require("./config/Database");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/user");
const conenctionRoute = require("./routes/connectionRoutes");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute, userRoute, conenctionRoute);

app.patch("/user", async (req, res) => {
  let id = req.body.userId;
  try {
    await User.findOneAndUpdate({ _id: id }, req.body);
    res.send("updated");
  } catch (err) {
    res.status(500).send("error" + err.message);
  }
});

connectDB()
  .then((res) => {
    console.log("connected to DB 123");
    app.listen(3000, () => {
      console.log("server started");
    });
  })
  .catch((err) => console.log(err));
