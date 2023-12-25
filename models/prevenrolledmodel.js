const mongoose = require("mongoose");

const prevenrolledSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    admissionNo: {
      type: String,
    },
    course: {
      type: String,
    },
   
  },
  {
    timestamps: true,
  }
);

const PrevEnrolled = mongoose.model("PrevEnrolled", prevenrolledSchema);
module.exports = Enrolled;
