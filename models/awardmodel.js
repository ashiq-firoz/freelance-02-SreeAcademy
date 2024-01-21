const mongoose = require("mongoose");

const awardListSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    awardee: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    name : {
      type:String,
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
    venue : {
      type : String,
    },
  },
  {
    timestamps: true,
  }
);

const AwardList = mongoose.model("AwardList", awardListSchema);
module.exports = AwardList;
