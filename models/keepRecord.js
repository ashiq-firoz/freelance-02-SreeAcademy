const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    user: {
      type: String,
      trim: true,
    },
    prevmonth: { //profit
      type: Number,
      trim: true,
    },
    thismonth: { //profit
      type: Number,
      trim: true,
    },
    teacherattendance : {
        type : Number,
        trim : true,
        default : 0,
    },
    totaldue : {
      type : Number,
      default : 0,
    },
    startdate : {
      type : String,
    }

  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model("keepRecord", recordSchema);
module.exports = Record;
