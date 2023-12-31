const Course = require("../models/coursemodel");
const multer = require('multer');

module.exports = {
    addcourse: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                //console.log(data)
            if(await Course.findOne({user:user,name:data["course"]})){
                resolve(false);
            }
            else{

            let d = await Course.create(
                {
                    user: user,
                    name: data['course'],
                    noOfClass: 0,
                    img: "",
                }
            );

            console.log(d);

            resolve(true);
            }
            }
            catch (err) {
                resolve(false);
            }
            

        });
    },

    getcourses: (user) => {
        return new Promise(async (resolve, reject) => {
            const courses = await Course.find({ user: user });

            resolve(courses);
        });
    },

    updatecourse: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(data);

                let course = await Course.findOne({ user: user, name: data['course'] });

                if (course == null) {
                    resolve(false);
                }
                else {
                    await Course.findByIdAndUpdate(
                        {
                            _id: course._id,
                        },
                        {
                            fee: data['fee'],
                            noOfClass : data['nos'],
                        }
                    );
                    resolve(true);
                }


            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        })

    },

}