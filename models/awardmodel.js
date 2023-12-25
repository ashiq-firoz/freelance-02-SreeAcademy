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
    stuname :{
      type : String,
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
    date:{
      type : String,
    },
  },
  {
    timestamps: true,
  }
);

const AwardList = mongoose.model("AwardList", awardListSchema);
module.exports = AwardList;
