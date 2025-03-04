const express = require("express");
const { authenticateUser } = require("../Middlewares/Auth");
const User = require("../models/User");
const { validateUpdateUserData } = require("../Utils/validations");
const Connection = require("../models/Connection");

const profileRouter = express.Router();

profileRouter.patch("/user/update", authenticateUser, async (req, res) => {
  try {
    const payload = req.body;
    const user = req.user;
    if (!validateUpdateUserData(payload)) {
      throw new Error("Cannot update these fields");
    }

    Object.keys(payload).forEach((key) => (user[key] = payload[key]));
    const newUser = await user.save();
    res.json(newUser);
  } catch (err) {
    res.status(500).send("Error " + err.message);
  }
});

profileRouter.get("/profile", authenticateUser, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(404).send("Error " + err.message);
  }
});

profileRouter.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Error Occured");
  }
});

profileRouter.get("/user/connections", authenticateUser, async (req, res) => {
  try {
    const { _id } = req.user;
    let connections = await Connection.find({
      $or: [
        { senderId: _id, status: "accepted" },
        { receiverId: _id, status: "accepted" },
      ],
    })
      .populate("senderId")
      .populate("receiverId");

    connections = connections.map((connection) => {
      if (connection.senderId._id === _id) {
        return connection.receiverId;
      } else {
        return connection.senderId;
      }
    });

    res.send(connections);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

profileRouter.get(
  "/user/requests/received",
  authenticateUser,
  async (req, res) => {
    const { _id } = req.user;
    try {
      let requestsReceived = await Connection.find({
        receiverId: _id,
        status: "interested",
      }).populate("senderId");
      requestsReceived = requestsReceived.map((req) => {
        return req.senderId;
      });

      res.json(requestsReceived);
    } catch (error) {
      res.status(400).send("Error " + error.message);
    }
  }
);

profileRouter.get("/user/feed", authenticateUser, async (req, res) => {
  const loggedInUser = req.user;
  try {
    //self, interested ignored accepted rejected ni chaiye
    const usersNotRequiredInFeed = await Connection.find({
      $or: [{ senderId: loggedInUser._id }, { receiverId: loggedInUser._id }],
    });
    let uniqueUsersNotRequiredInFeed = new Set();
    usersNotRequiredInFeed.forEach((user) => {
      uniqueUsersNotRequiredInFeed.add(user.senderId);
      uniqueUsersNotRequiredInFeed.add(user.receiverId);
    });
    const feedUsers = await User.find({
      _id: { $nin: Array.from(uniqueUsersNotRequiredInFeed) },
    });
    res.json(feedUsers);
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});

profileRouter.get("/feed", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

module.exports = profileRouter;
