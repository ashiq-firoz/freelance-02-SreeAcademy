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
    },

    
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model("keepRecord", recordSchema);
module.exports = Record;
