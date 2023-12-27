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
    date:{
      type : String,
    },
    venue : {
      type : String,
    },
    artists : {
        type : String,
    },
  },
  {
    timestamps: true,
  }
);

const AwardList = mongoose.model("2ndAwardList", awardListSchema);
module.exports = AwardList;
