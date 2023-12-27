const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Please add user"],
      trim: true,
    },
    code : {
      type : String,
    },
    name: {
      type: String,
      required: [true, "Please add name"],
      trim: true,
    },
    start_date: {
      type: String,
    },
    dob: {
      type: String,
    },
    course : {
      type : String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    attendance: {
      type: Number,
      default : 0
    },
    noofclass :{
      type : Number,
      default : 0,
    }
   
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
