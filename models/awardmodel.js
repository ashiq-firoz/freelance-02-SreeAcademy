const mongoose = require("mongoose");

const awardListSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    admNo: {
      type: String,
      required: [true, "Please add admNo"],
      trim: true,
    },
    event: {
      type: String,
      required: [true, "Please add event"],
      trim: true,
    },
    awardName: {
      type: String,
      required: [true, "Please add awardName"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const AwardList = mongoose.model("AwardList", awardListSchema);
module.exports = AwardList;
