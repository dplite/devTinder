const uri = "mongodb+srv://db123:db123@cluster0.bzoqp.mongodb.net/devTinder";

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(uri);
};

module.exports = { connectDB };
