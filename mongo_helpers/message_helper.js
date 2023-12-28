const accountSid = 'ACe89272c5c418b3829cefcfa4b0e1842e';
const authToken = '853c54f3cec0096e4f32ef6c08d2c0c6';
const client = require('twilio')(accountSid, authToken);

const Student = require("../models/studentmodel");


module.exports = {
    sendmessage: (list, message) => {
        return new Promise(async (resolve, reject) => {
            try {
                
                if (!Array.isArray(list)) {
                    list = [list]
                }
                console.log(list);

                for (i = 0; i < list.length; i++) {
                    client.messages
                        .create({
                            body: 'hello',
                            from: 'whatsapp:+14155238886',
                            to: 'whatsapp:+91'+list[i],
                        })
                        .then(message => console.log(message.sid));

                }
                resolve(true)
            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        });
    },

    getwatchlist : (user)=>{
        return new Promise(async(resolve,reject)=>{
            try
            {
                const students = await Student.find({ user: user, attendance: { $lt: 30 } });

                resolve(students);
            }
            catch(err)
            {
                console.log(err);
                resolve(false);
            }
        });
    },

    getstarred : (user)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const students = await Student.find({user:user,star : true});

                resolve(students);
            }
            catch(err)
            {
                console.log(err)
                resolve(false);
            }
        });
    },



}