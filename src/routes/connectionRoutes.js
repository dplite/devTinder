const express = require("express");
const conectionRouter = express.Router();
const { authenticateUser } = require("../Middlewares/Auth");
const Connection = require("../models/Connection");
const {
  validateSendConnectionRequest,
  validateAcceptConnectionRequest,
} = require("../Utils/validations");

conectionRouter.post(
  "/connection/:status/:_id",
  authenticateUser,
  async (req, res) => {
    const { status, _id } = req.params;

    try {
      const senderId = req.user._id;
      const receiverId = _id;

      if (!(await validateSendConnectionRequest(req, res))) {
        const connection = await new Connection({
          senderId,
          receiverId,
          status,
        });

        const newConnectionDoc = await connection.save();
        res.json({ newConnectionDoc });
      }
    } catch (error) {
      res.status(500).send("Error " + error.message);
    }
  }
);

conectionRouter.post(
  "/respond/:status/:requestId",
  authenticateUser,
  async (req, res) => {
    try {
      if (await validateAcceptConnectionRequest(req, res)) {
        res.send("Accepted successfuly");
      }
    } catch (error) {
      res.status(500).send("Error " + error.message);
    }
  }
);

module.exports = conectionRouter;
