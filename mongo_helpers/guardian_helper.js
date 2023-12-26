const Guardian = require("../models/guardianmodel");

module.exports = {
    addguardian : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                if(data['student']!="null"){
                    const guardian = await Guardian.create({
                        user: user,
                        guardian : data['guardian'],
                        parent : data['parent'],
                        phone1 : data['phone1'],
                        phone2 : data['phone2'],
                        email : data['email'],
                        whatsapp : data['whatsapp'],
                        student : data['student'],
                    });
                    resolve(true);
                }
                else{
                    resolve(false);
                }
            }
            catch(err){
                resolve(false);
            }
        });
        
    },

    updateguardian : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const guardian = await Guardian.findOne({user:user,student : data['student']});

                if(guardian != null){
                    await Guardian.findByIdAndUpdate(
                        {
                            _id : guardian._id,
                        },
                        {
                            guardian : data['guardian'],
                            parent : data['parent'],
                            phone1 : data['phone1'],
                            phone2 : data['phone2'],
                            email : data['email'],
                            whatsapp : data['whatsapp'],
                        }
                        );
                }
                else{
                    resolve(false);
                }
            }
            catch(err){

            }
        });
    },

    
}