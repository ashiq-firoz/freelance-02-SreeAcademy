const Attendance = require('../models/attendancemodel');
const Enroll = require("../models/enrolledmodel");
const Course = require("../models/coursemodel");
const Student = require("../models/studentmodel");
const { use } = require('../routes');


module.exports = {
  addattendance: (user, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        var list = data['present'];


        if (!Array.isArray(list)) {
          list = [list]
        }
        console.log(list)

        for (i = 0; i < list.length; i++) {
          const item = list[i];
          //console.log(item)
          // Extract numeric part
          let numericPart = item.match(/^(.*?)present/i);

          // Extract text part
          let textPart = "present"; // Since "present" is constant in your case

          // Check if matches were found
          numericPart = numericPart ? numericPart[1] : null;

          let courses;
          console.log("admno :" + numericPart);
          console.log(numericPart)
          
          const enrolledCourses = await Enroll.find({ user: user, admissionNo: numericPart });

          courses = enrolledCourses.map(course => course.course);
          //console.log(enrolledCourses);
          //console.log(courses);

          const sumResult = await Course.aggregate([
            {
              $match: {
                name: { $in: courses },
              },
            },
            {
              $group: {
                _id: null,
                totalNoOfClass: { $sum: "$noOfClass" },
              },
            },
          ]).exec();

          // Result will be an array containing the sum of noOfClass for the specified courses
          var sum = sumResult.length > 0 ? sumResult[0].totalNoOfClass : 0;

          console.log(sum)

          sum += 1

          const stu = await Student.findOne({ user: user, adminNo: numericPart });
          //console.log(stu);
          var classes = stu.totalnoofclass;

          if (textPart == "present") {
            classes += 1
            await Attendance.create({ user: user, admissionNo: numericPart, course: data['course'], present: true, date: data['date'] });
          }
          else {
            await Attendance.create({ user: user, admissionNo: numericPart, course: data['course'], present: false, date: data['date'] });
          }
          let attend = (classes / sum) * 100;

          console.log("attendance " + attend)
          console.log("classes : " + classes)
          attend = (Math.round(attend * 100) / 100).toFixed(2);

          await Student.findByIdAndUpdate(
            {
              _id: stu._id,
            },
            {
              attendance: attend,
              totalnoofClass: classes,
            }
          );


        }
        console.log(data['course']);
        const course = await Course.findOne({ user: user, name: data['course'] });
        await Course.findByIdAndUpdate(
          {
            _id: course._id
          },
          {
            noOfClass: course.noOfClass + 1,
          }
        );

        resolve(true);
      }
      catch (err) {
        console.log(err);
        resolve(false);
      }
    });
  },

  addteacherattendance: (user, data) => {

  },

  getstudentsforattendance: (user, course) => {
    return new Promise(async (resolve, reject) => {
      try {
        let students = await Enroll.find({ user: user, course: course });

        resolve(students);
      }
      catch (err) {
        resolve(false);
      }
    });
  },

  getstudattendancedetail: (user, admno) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Attendance.find({ user: user, admissionNo: admno, teacher: false });
        resolve(data);
      }
      catch (err) {
        resolve(false)
      }
    });
  }

}