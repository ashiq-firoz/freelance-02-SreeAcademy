const Student = require("../models/studentmodel");
const Enroll = require("../models/enrolledmodel");
const PreEnroll = require("../models/prevenrolledmodel");
const Guardian = require("../models/guardianmodel");
const Course = require("../models/coursemodel");
const Payment = require("../models/paymentmodel");
const Hall = require("../models/hallofrramemodel");

module.exports = {

    getstudents: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                let students = await Student.find({ user: user });
                let guardian = await Guardian.find({user:user});
                
                resolve([students,guardian]);
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    addstudent: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let student = await Student.findOne({ user: user, adminNo: data["admno"] });

                if (student != null) {
                    
                    await Student.findByIdAndUpdate(
                        {
                            _id: student._id,
                        },
                        {
                            user: user,
                            name: data["name"],
                            adminNo: data['admno'],
                            age: data['age'],
                            gender: data['gender'],
                            dob: data['dob'],
                            dateOfAdmission: data['dateofadm'],
                            attendance: 0,
                            watchList: false,
                            star: false,
                            previousStudent: false,
                        }
                    )
                    resolve(true);
                }
                else {
                    await Student.create(
                        {
                            user: user,
                            name: data["name"],
                            adminNo: data['admno'],
                            age: data['age'],
                            gender: data['gender'],
                            dob: data['dob'],
                            dateOfAdmission: data['dateofadm'],
                            attendance: 0,
                            totalnoofclass:0,
                            watchList: false,
                            star: false,
                            previousStudent: false,
                        }
                    )
                    resolve(true);
                }
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    updatestudent: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let student = await Student.findOne({ user: user, adminNo: data["admno"] });

                if (student == null) {
                    resolve(false);
                }
                else {
                    await Student.findByIdAndUpdate(
                        {
                            _id: student._id,
                        },
                        {
                            user: user,
                            name: data["name"],
                            adminNo: data['admno'],
                            age: data['age'],
                            gender: data['gender'],
                            dob: data['dob'],
                            dateOfAdmission: data['dateofadm'],
                            attendance: 0,
                            watchList: false,
                            star: false,
                            previousStudent: false,
                        }
                    )
                    resolve(true);
                }
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    updateattendance: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let student = await Student.findOne({ user: user, adminNo: data["admno"] });

                if (student == null) {
                    resolve(false);
                }
                else {
                    await Student.findByIdAndUpdate(
                        {
                            _id: student._id,
                        },
                        {

                            attendance: student.attendance + 1,

                        }
                    )
                    resolve(true);
                }
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    changewatchlist: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const stu = await Student.findOne({ user: user, adminNo: data });
                let st = true;
                
                if(stu.watchList==true){
                    st = false;
                }
                else{
                    st = true;
                }
                if (stu == null) {
                    resolve(false);
                }
                else {
                    await Student.findByIdAndUpdate(
                        {
                            _id: stu._id,
                        },
                        {
                            watchList: st
                        }
                    );

                    resolve(true);
                }
            }
            catch (err) {
                console.log(err);
                resolve(false);
            }
        });
    },

    changestar: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const stu = await Student.findOne({ user: user, adminNo: data['admno'] });
                let st = true;
                if (data['status'] == "true") {
                    st = true;
                }
                else {
                    st = false;
                }

                if(stu.star==true){
                    st = false;
                }
                else{
                    st = true;
                }

                if (stu == null) {
                    resolve(false);
                }
                else {
                    await Student.findByIdAndUpdate(
                        {
                            _id: stu._id,
                        },
                        {
                            star: st
                        }
                    );

                    resolve([true,!st]);
                }
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    getwatchliststudents : (user)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const students = await Student.find({user:user,watchList:true});
                const guardian = await Guardian.find({user:user});
                resolve([students,guardian]);
            }
            catch(err)
            {
                console.log(err)
                resolve(null);
            }
        });
    },

    getstudent: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                //console.log(data)
                const students = await Student.findOne({ user: user, adminNo: data });

                const guardian = await Guardian.findOne({ user: user, student: data });

                const enroll = await Enroll.find({ user: user, admissionNo: data });

                const prev = await PreEnroll.find({ user: user, admissionNo: data });

                const courses = await Course.find({ user: user });

                const courselist = enroll.map(enroll => enroll.course);

                const imgs = await Hall.find({user:user,student : data});


                const result = await Course.aggregate([
                    {
                      $match: { user: user ,name: { $in: courselist }}
                    },
                    {
                      $group: {
                        _id: null,
                        totalFees: { $sum: '$fee' } // Replace 'fee' with the actual field name containing the fees
                      }
                    }
                  ]);
                
                // Access the total sum of fees from the result
                let totalFees = result.length > 0 ? result[0].totalFees : 0;
                console.log("sum : "+totalFees);

                const payment = await Payment.find({ user: user, student: data });

                if(payment!=null){
                    let result = await Payment.aggregate([
                        {
                          $match: { user: user , student: data}
                        },
                        {
                          $group: {
                            _id: null,
                            totalFees: { $sum: '$amount' } // Replace 'fee' with the actual field name containing the fees
                          }
                        }
                      ]);
                    
                    // Access the total sum of fees from the result
                    const totalamt = result.length > 0 ? result[0].totalFees : 0;   
                    totalFees = totalFees - totalamt;
                }

                // console.log(students)


                resolve([students, guardian, enroll, prev, courses, payment,totalFees,imgs]);
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    addstucourse: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let c = await Enroll.create({
                    user: user,
                    name: data['name'],
                    admissionNo: data['admno'],
                    course: data['course'],
                });

                console.log(c)

                resolve(true);
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    delcourse: (user, data) => { //pass _id
        return new Promise(async (resolve, reject) => {
            try {
                const c = await Enroll.findOne({ _id: data['id'] });

                await PreEnroll.create(
                    {
                        user: c['user'],
                        name: c['name'],
                        course: c['course'],
                        admissionNo: c['admissionNo'],
                    }
                );

                await Enroll.deleteOne({ _id: data['id'] });
                resolve(true);
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    delstupayment : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await Payment.deleteOne({user:user,_id:data['id']});

                resolve(true);
            }
            catch(err)
            {
                console.log(err)
                resolve(false);
            }
        });
    },

    addstupayment: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                //console.log("data")
                //console.log(data)
                const p = await Payment.create({
                    user: user,
                    student: data['admno'],
                    amount: data['amount'],
                    reciptno: data['receiptNo'],
                    balance: data['due'],
                    date: data['date'],
                })
                //console.log(p);
                const record = await Keep.findOne({ user: user });

                // Current date
                var currentDate = new Date();

                // Add one month to the current date
                var oneMonthLater = new Date(currentDate);
                oneMonthLater.setMonth(currentDate.getMonth() + 1);

                let prev = record.prevmonth;
                let curr = record.thismonth;

                let date = record.startdate;

                if (record.startdate >= oneMonthLater) {
                    // Format options
                    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };

                    // Format the current date
                    var formattedCurrentDate = currentDate.toLocaleDateString('en-US', options);
                    date = formattedCurrentDate;
                    prev = curr;
                    curr = data['amount'];
                }
                else {
                    curr += Number(data['amount']);
                }

                let totaldue = record.totaldue + Number(data['due'])

                await Keep.findByIdAndUpdate(
                    { _id: record._id },
                    {
                        startdate : date,
                        prevmonth : prev,
                        thismonth : curr,
                        totaldue : totaldue,
                    }
                )

                resolve(true);
            }
            catch (err) {
                //console.log(err);
                resolve(false);
            }
        });
    },

    deleteStudent : (user,id)=>{
        return new Promise (async(resolve,reject)=>{
            try{
                const stu = await Student.findOne({_id:id});

            const admno = stu.adminNo;

            await Student.deleteOne({_id:id});
            
            try{
            await Guardian.deleteMany({student : admno});

            await Enroll.deleteMany({admissionNo : admno});

            await PreEnroll.deleteMany({admissionNo : admno});

            await Payment.deleteMany({student : admno});

            resolve(true);
            }
            catch(err){
                console.log(err)
                resolve(false);
            }
            }
            catch(err){
                console.log(err)
                resolve(false);
            }
            
        });
    },

    addphoto : (user,files,admno)=>{
        return new Promise(async(resolve,reject)=>{
            //req.files
            if (files) {
                const file = files.image;
                const fileName =
                  "public/users/img/profile" + admno + ".png";
          
                file.mv(fileName, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });

                try{
                    const student = await Student.findOne({user:user});
                    
                    await Student.findByIdAndUpdate(
                        {
                            _id:student._id
                        },
                        {
                            img : fileName,
                        }
                    )
                    resolve(true);
                }
                catch(err){
                    resolve(false);
                }

                
              }
            else{
                resolve(false);
            }
          
        })
    },

    addToHall : (user,admno,files)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const file = files.userPicture;
                let imgs = await Hall.find({user:user,student:admno});
                let c = 0;
                if(imgs == null){
                    c = 0;
                }
                else{
                    c = imgs.length;
                }
                const fileName =
                  "public/users/img/hallOfFrame" + admno +""+c+ ".png";

                const storename =  "/users/img/hallOfFrame" + admno +""+c+ ".png";
          
                file.mv(fileName, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });

                await Hall.create(
                    {
                        user:user,
                        student : admno,
                        img : storename,
                    }
                );
                resolve(true);
            }
            catch(err){
                console.log(err);
                resolve(false);
            }
        });
    },

    getHallOfFrame : (user,admno)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const imgs = await Hall.find({user:user,student:admno});
                resolve(imgs);
            }
            catch(err)
            {
                console.log(err)
                resolve(false);
            }
        });
    },

}