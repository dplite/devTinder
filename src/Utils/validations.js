const Connection = require("../models/Connection");

const validateUpdateUserData = (payload) => {
  const fieldsAllowedToUpdate = ["firstName", "lastName", "gender", "skills"];

  const isValid = Object.keys(payload).every((key) =>
    fieldsAllowedToUpdate.includes(key)
  );

  return isValid;
};

const validateSendConnectionRequest = async (req, res) => {
  let hasError = false;

  const { status, _id } = req.params;
  let allowedStatus = ["interested", "ignore"];
  if (!allowedStatus.includes(status)) {
    hasError = true;
    throw new Error("Error, incorrect status");
  }
  const alreadyExistingData = await Connection.findOne({
    $or: [
      { senderId: req.user._id, receiverId: _id },
      { senderId: _id, receiverId: req.user._id },
    ],
  });
  if (alreadyExistingData) {
    hasError = true;
    throw new Error("Cannot send request, already processed");
  }
  // } else if (req.user._id.equals(_id)) {
  //   hasError = true;
  //   throw new Error("Cannot send request to self");
  // }

  return hasError;
};

const validateAcceptConnectionRequest = async (req) => {
  let allowedStatus = ["accepted", "rejected"];
  const _id = req.params.requestId;
  const { status } = req.params;
  let isValid = true;
  if (!allowedStatus.includes(status)) {
    isValid = false;
    throw new Error("Incorrect status");
  }

  const isUserReceiving = await Connection.findOne({
    _id,
    receiverId: req.user._id,
    status: "interested",
  });
  if (!isUserReceiving) {
    isValid = false;
    throw new Error("Cannot Find user to send");
  }

  if (isValid) {
    isUserReceiving.status = "accepted";
    await isUserReceiving.save();
  }

  return isValid;
};

module.exports = {
  validateUpdateUserData,
  validateSendConnectionRequest,
  validateAcceptConnectionRequest,
};
