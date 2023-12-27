const Award = require("../models/awardmodel");
const Award2 = require("../models/2ndawardmode");
const Event = require("../models/eventsmodal");

module.exports = {
    addEventdata : (user,event,data)=>{
        return new Promise(async(resolve,reject) =>{
            try{
                
                const award = await Award.create(
                    {
                        user:user,
                        event:event,
                        date : data['date'],
                        venue : data['venue'],
                        awardee : data['awardee'],
                        awardName : data['awardname'],

                    }
                );
                resolve(true);
            }
            catch(err)
            {
                console.log(err)
                resolve(false);
            }
        });
    },

    addEventdata2 : (user,data)=>{
        return new Promise(async(resolve,reject) =>{
            try{
                const award = await Award2.create(
                    {
                        user:user,
                        date : data['date'],
                        venue : data['venue'],
                        awardee : data['awardee'],
                        artists : data['artists'],
                    }
                );
                resolve(true);
            }
            catch(err)
            {
                console.log(err)
                resolve(false);
            }
        });
    },

    addMultiData : (user,event,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let list = data['awardname']

                for(i=0;i<list.length;i++){
                    await Award.create(
                        {
                            user:user,
                        event:event,
                        date : data['date'][i],
                        venue : data['venue'][i],
                        awardee : data['awardee'][i],
                        awardName : data['awardname'][i],
                        }
                    );
                }
                resolve(true);
            }
            catch(err)
            {
                console.log(err);
                resolve(false);
            }
        });
    },

    addNewEvent : (user,event)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                await Event.create(
                    {
                        user:user,
                        event : event,
                    }
                );
                resolve(true);
            }
            catch(err)
            {
                console.log(err);
            }
        });
    },

    addMultidata2 : (user,data)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let list = data['awardee'];

                for(i=0;i<list.length;i++){
                    await Award2.create(
                        {
                            user:user,
                            awardee : data['awardee'][i],
                            date : data['date'][i],
                            venue : data['venue'][i],
                            artists : data['artists'][i],
                        }
                    )
                }

                resolve(true);
            }
            catch(err){
                console.log(err)
                resolve(false);
            }
        });
    },

    getawards : (user,event)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const awards = await Award.find({user:user,event:event});
                resolve(awards);
            }
            catch(err)
            {
                console.log(err);
                resolve(false);
            }
        });
    },

    getawards2 : (user)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                const awards = await Award2.find({user:user});

                resolve(awards);
            }
            catch(err)
            {
                console.log(err)
                resolve(false);
            }
        });
    },
    
}