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
                            contact : data['contact'],
                            address : data['address'],
                            salarydate :data['salarydate'],
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

    getteachers: (user) => {
        return new Promise(async(resolve,reject)=>{
            try{
                const teachers = await Teacher.find({user:user});
                const courses = await Course.find({user:user});
                
                resolve([teachers,courses]);
            } 
            catch(err){
                console.log(err);
                resolve(null);
            }
        });

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

    updateteacherattendance: (user, data) => {
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
                     
                    //console.log(numericPart)

                    let teacher = await Teacher.findOne({ user: user, code: numericPart });

                    //console.log(teacher);

                    const course = await Course.findOne({user:user, name : teacher.course});

                    console.log(course);
                    let attend;
                    let stat = false;
                    if(textPart=="present"){
                        attend = (teacher.noofclass+1)/(course.noOfClass+1)*100;
                        stat = true;
                    }
                    else{
                        attend = (teacher.noofclass)/(course.noOfClass+1)*100;
                    }
                    //console.log("attend"+attend);
                    attend = (Math.round(attend * 100) / 100).toFixed(2);

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
                console.log(err);
                resolve(false)
            }
        });
    }
}