const Teacher = require("../models/teachermodel");
const Course = require("../models/coursemodel");
const Attendance = require('../models/attendancemodel');



module.exports = {
    addteacher: (user, data) => {

        return new Promise(async (resolve, reject) => {
            try {
                const teacher = await Teacher.findOne({ user: user, code: data["code"] });

                if (teacher != null) {
                    resolve(false);
                }
                else {
                    let newTeacher = await Teacher.create(
                        {
                            user: user,
                            code: data['code'],
                            dob: data['dob'],
                            gender: data['gender'],
                            age: data['age'],
                            start_date: data['start'],
                            name: data['name'],
                            course : data['course'],
                        }
                    );
                    resolve(true);
                }
            }
            catch (err) {
                resolve(false);
            }
        });

    },

    updateteacher: (user, data) => {

    },

    getteacher: (user, data) => {

    },

    getteacherattendance : (user,code)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const data = await Attendance.find({user:user,teacher:true,admissionNo:code});
                resolve(data);
            }
            catch(err){
                resolve(false);
            }
        });
    },

    updateattendance: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                var list = data["present"];

                if (!Array.isArray(list)) {
                    list = [list]
                }

                for (i = 0; i < list.length; i++) {
                    const item = list[i];
                    //console.log(item)
                    // Extract numeric part
                    let numericPart = item.match(/\d+/);

                    // Extract text part
                    let textPart = item.match(/[a-zA-Z]+/);

                    // Check if matches were found
                    numericPart = numericPart ? numericPart[0] : null;
                    textPart = textPart ? textPart[0] : null;

                    let teacher = await Teacher.findOne({ user: user, code: numericPart });

                    const course = await Course.findOne({user:user,name : teacher.course});
                    let attend;
                    let stat = false;
                    if(textPart=="present"){
                        attend = (teacher.noofclass+1)/(course.noOfClass+1)*100;
                        stat = true;
                    }
                    else{
                        attend = (teacher.noofclass)/(course.noOfClass+1)*100;
                    }

                    await Teacher.findByIdAndUpdate(
                        {
                            _id : teacher._id
                        },
                        {
                            attendance : attend,
                        }
                    );
                    
                    await Attendance.create({
                        user:user,
                        admissionNo : teacher.code,
                        course : course.name,
                        present : stat,
                        teacher : true,
                        date : data['date'],
                    });
                }

                resolve(true);
            }
            catch (err) {
                resolve(false)
            }
        });
    }
}