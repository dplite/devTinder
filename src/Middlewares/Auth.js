const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateUser = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    const decoded = await jwt.verify(token, "secretKey111");
    let user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error("Unauthorized, please login again");
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(404).send("Error " + error.message);
  }
};

module.exports = { authenticateUser };
