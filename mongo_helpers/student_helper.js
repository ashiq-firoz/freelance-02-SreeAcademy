const Student = require("../models/studentmodel");
const Enroll = require("../models/enrolledmodel");
const PreEnroll = require("../models/prevenrolledmodel");
const Guardian = require("../models/guardianmodel");
const Course = require("../models/coursemodel");
const Payment = require("../models/paymentmodel");

module.exports = {
    
    getstudents : (user)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let students = await Student.find({user: user});
                resolve(students);
            }
            catch(err)
            {
                resolve(false);
            }
        });
    },

    addstudent : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let student = await Student.findOne({user:user,adminNo:data["admno"]});

                if(student!=null){
                    resolve(false);
                }
                else{
                    await Student.create(
                        {
                            user : user,
                            name : data["name"],
                            adminNo : data['admno'],
                            age : data['age'],
                            gender : data['gender'],
                            dob : data['dob'],
                            dateOfAdmission : data['dateofadm'],
                            attendance : 0,
                            watchList : false,
                            star : false,
                            previousStudent : false,
                        }
                    )
                    resolve(true);
                }
            }
            catch(err){
                resolve(false);
            }
        });
    },

    updatestudent : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let student = await Student.findOne({user:user,adminNo:data["admno"]});

                if(student==null){
                    resolve(false);
                }
                else{
                    await Student.findByIdAndUpdate(
                        {
                            _id : student._id,
                        },
                        {
                            user : user,
                            name : data["name"],
                            adminNo : data['admno'],
                            age : data['age'],
                            gender : data['gender'],
                            dob : data['dob'],
                            dateOfAdmission : data['dateofadm'],
                            attendance : 0,
                            watchList : false,
                            star : false,
                            previousStudent : false,
                        }
                    )
                    resolve(true);
                }
            }
            catch(err){
                resolve(false);
            }
        });
    },

    updateattendance : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let student = await Student.findOne({user:user,adminNo:data["admno"]});

                if(student==null){
                    resolve(false);
                }
                else{
                    await Student.findByIdAndUpdate(
                        {
                            _id : student._id,
                        },
                        {
                           
                            attendance : student.attendance + 1,
                            
                        }
                    )
                    resolve(true);
                }
            }
            catch(err){
                resolve(false);
            }
        });
    },

    changewatchlist : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const stu = await Student.findOne({user:user,adminNo:data['admno']});
                let st = true;
                if(data['status']=="t"){
                    st = true;
                }
                else{
                    st = false;
                }
                if(stu==null){
                    resolve(false);
                }
                else{
                    await Student.findByIdAndUpdate(
                        {
                            _id:stu._id,
                        },
                        {
                            watchList : st
                        }
                    );

                    resolve(true);
                }
            }
            catch(err){
                resolve(false);
            }
        });
    },

    changestar : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const stu = await Student.findOne({user:user,adminNo:data['admno']});
                let st = true;
                if(data['status']=="t"){
                    st = true;
                }
                else{
                    st = false;
                }
                if(stu==null){
                    resolve(false);
                }
                else{
                    await Student.findByIdAndUpdate(
                        {
                            _id:stu._id,
                        },
                        {
                            star : st
                        }
                    );

                    resolve(true);
                }
            }
            catch(err){
                resolve(false);
            }
        });
    },

    getstudent : (user,data)=>{
        return new Promise(async (resolve,reject)=>{
            try{
                //console.log(data)
                const students = await Student.findOne({user:user,adminNo:data});

                const guardian = await Guardian.findOne({user:user,student:data});

                const enroll = await Enroll.find({user:user,admissionNo:data});

                const prev = await PreEnroll.find({user:user,admissionNo:data});

                const courses = await Course.find({user:user});

                const payment = await Payment.find({user:user,student : data});

                // console.log(students)


                resolve([students,guardian,enroll,prev,courses,payment]);
            }
            catch(err){
                resolve(false);
            }
        });
    },

    addstucourse : (user,data)=>{
        return new Promise (async(resolve,reject)=>{
            try{
                let c = await Enroll.create({
                    user:user,
                    name : data['name'],
                    admissionNo : data['admno'],
                    course : data['course'],
                });

                console.log(c)

                resolve(true);
            }
            catch(err){
                resolve(false);
            }
        });
    },

    delcourse : (user,data)=>{ //pass _id
        return new Promise(async(resolve,reject)=>{
            try{
                const c = await Enroll.findOne({_id:data['id']});

            await PreEnroll.create(
                {
                    user : c['user'],
                    name : c['name'],
                    course : c['course'],
                    admissionNo : c['admissionNo'],
                }
            );

            await Enroll.deleteOne({_id : data['id']});
            resolve(true);
            }
            catch(err){
                resolve(false);
            }
        });
    },

    addpayment : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                console.log("data")
                console.log(data)
                const p = await Payment.create({
                    user : user,
                    student : data['admno'],
                    amount : data['amount'],
                    reciptno : data['receiptNo'],
                    balance : data['due'],
                    date : data['date'],
                })
                console.log(p);
                resolve(true);
            }
            catch(err){
                console.log(err);
                resolve(false);
            }
        });
    }
}