const User = require("../models/usermodel");
const bcrypt = require("bcrypt");

module.exports = {
    createuser : (data)=>{
        return new Promise(async (resolve,reject)=>{
            try{
                const pss = await bcrypt.hash(data["password"], 10); 
                const user = await User.create(
                    {
                        name : data["name"],
                        password : pss,
                        email : data["email"],
                    }
                )
            }
            catch(err){
                console.log(err)
                resolve(false);
            }
        });
    },

    verifyuser : (data)=>{
        return new Promise(async(resolve, reject)=> {
            try{
                let user = await User.findOne({"name":data['name']});

                if(user == null){
                    resolve(false);
                }
                else{
                    bcrypt
                    .compare(data["password"], user["password"])
                    .then((status) => {
                      if (status) {
                        console.log("logged in");
                        resolve(user);
                      } else {
                        resolve(false);
                      }
                    });
                }
            }
            catch(err){
                resolve(false);
            }
        });
    },

    updateuser : (data)=>{
          return new Promise(async(resolve,reject)=>{
            let user = await User.findOne({"name":data['oldname']});
            if(!user){
                resolve(false);
            }
            else{
                await User.findByIdAndUpdate(
                    {
                        _id : user._id,
                    },
                    {
                        name : data['name'],
                        email : data['email'],
                    }
                )
                resolve(true);
            }
          });
    },

    updatepassword : (data)=>{
        return new Promise (async(resolve,reject)=>{
            try{
                let user = await User.findOne({"name":data['name']});

                if(user == null){
                    resolve(false);
                }
                else{
                    bcrypt
                    .compare(data["password"], user["password"])
                    .then(async(status) => {
                      if (status) {
                        console.log("changing");
                        await User.findByIdAndUpdate(
                            {
                                _id : user._id,
                            },
                            {
                                password: await bcrypt.hash(data["newpassword"], 10),
                            }
                            )
                        resolve(true);

                      } else {
                        resolve(false);
                      }
                    });
                }
            }
            catch(err){
                resolve(false);
            }
        });
    }

}