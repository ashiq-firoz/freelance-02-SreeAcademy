const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
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
    adminNo: {
      type: String,
    },
    dateOfAdmission: {
      type: String,
    },
    dob: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    attendance: {
      type: Number,
    },
    watchList: {
      type: Boolean,
    },
    star: {
      type: Boolean,
    },
    previousStudent : {
      type : Boolean,
    },
    totalnoofclass : {
      type : Number,
      default : 0,
    },
    img : {
      type:String,
      default : "/img/profile.png"
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
