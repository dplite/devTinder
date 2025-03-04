const mongoose = require("mongoose");

const ConnectionSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["interested", "ignore", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

ConnectionSchema.pre("save", function () {
  //always use normal function (not arrow) in schema files
  if (this.senderId.equals(this.receiverId)) {
    throw new Error("Sender and Receiver ID cannot be same");
  }
});

const ConnectionModel = mongoose.model("connection", ConnectionSchema);

module.exports = ConnectionModel;
