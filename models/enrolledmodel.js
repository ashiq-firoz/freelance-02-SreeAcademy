const mongoose = require("mongoose");

const enrolledSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    student: {
      type: String,
      required: [true, "Please add student"],
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
    expiry: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Enrolled = mongoose.model("Enrolled", enrolledSchema);
module.exports = Enrolled;
