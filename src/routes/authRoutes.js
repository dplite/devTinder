const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  //creating new instance of usermodel
  try {
    const { firstName, lastName, email, gender, password } = req.body;
    let enPass = await bcrypt.hash(password, 10);
    let user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      gender: gender,
      password: enPass,
    });
    await user.save();
    res.json(req.body);
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFoundWithEmail = await User.findOne({ email: email });

    if (!userFoundWithEmail) {
      throw new Error("Invalid CC");
    }
    const match = await bcrypt.compare(password, userFoundWithEmail.password);
    if (match) {
      const token = jwt.sign({ _id: userFoundWithEmail._id }, "secretKey111");
      res.cookie("token", token);
      res.json(userFoundWithEmail);
    } else {
      res.status(404).send("Invalid Creds");
    }
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null).send("logged out");
});

module.exports = authRouter;
