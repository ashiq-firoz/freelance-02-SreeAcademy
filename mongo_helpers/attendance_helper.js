const Attendance = require('../models/attendancemodel');
const Enroll = require("../models/enrolledmodel");
const Course = require("../models/coursemodel");
const Student = require("../models/studentmodel");


module.exports = {
    addattendance: (user, data) => {
        return new Promise(async(resolve, reject) => {
           try{
            var list = data['present'];

            for (var item in list) {
                // Extract numeric part
                let numericPart = item.match(/\d+/);

                // Extract text part
                let textPart = item.match(/[a-zA-Z]+/);

                // Check if matches were found
                numericPart = numericPart ? numericPart[0] : null;
                textPart = textPart ? textPart[0] : null;

                let courses ;

                await Enroll.find({ user: user,admissionNo:numericPart }, (err, enrolledCourses) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  
                    // Extract the list of courses from the enrolledCourses array
                    courses = enrolledCourses.map(course => course.course);
                  });
                
                let sum;

                await  Course.aggregate([
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
                  ]).exec((err, result) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                  
                    // Result will be an array containing the sum of noOfClass for the specified courses
                    sum = result.length > 0 ? result[0].totalNoOfClass : 0;
                  });

                sum += 1

                const stu = await Student.findOne({user:user,adminNo:numericPart});

                const classes = stu.totalnoofclass; 

                if(textPart=="present"){
                    classes += 1
                    let attend = (classes/sum)*100;

                    await Student.findByIdAndUpdate(
                        {
                            _id:stu._id,
                        },
                        {
                            attendance : attend,
                            totalnoofClass : classes,
                        }
                    )
                }
            }

            const course = await Course.findOne({user:user,name : data['course']});
            await Course.findByIdAndUpdate(
                {
                    _id:course._id
                },
                {
                    noOfClass : course.noOfClass + 1,
                }
            );

            resolve(true);
           }
           catch(err){
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
    }

}