const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const Event = require("../models/eventmodel");
const Keep = require('../models/keepRecord');

const { format, addDays } = require('date-fns');

module.exports = {
    createuser: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pss = await bcrypt.hash(data["password"], 10);
                const user = await User.create(
                    {
                        name: data["name"],
                        password: pss,
                        email: data["email"],
                    }
                );
                resolve(true);
            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        });
    },

    verifyuser: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.findOne({ "name": data['name'] });

                if (user == null) {
                    resolve(false);
                }
                else {
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
            catch (err) {
                resolve(false);
            }
        });
    },

    updateuser: (data) => {
        return new Promise(async (resolve, reject) => {
            console.log(data)
            let user = await User.findOne({ "name": data['oldname'] });
            if (!user) {
                resolve(false);
            }
            else {
                bcrypt
                    .compare(data["password"], user["password"])
                    .then(async (status) => {
                        if (status) {
                            console.log("updating");
                            await User.findByIdAndUpdate(
                                {
                                    _id: user._id,
                                },
                                {
                                    name: data['name'],
                                    email: data['email'],
                                }
                            )
                            resolve(true);

                        } else {
                            resolve(false);
                        }
                    });
            }
        });
    },

    updatepassword: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.findOne({ "name": data['name'] });

                if (user == null) {
                    resolve(false);
                }
                else {
                    bcrypt
                        .compare(data["password"], user["password"])
                        .then(async (status) => {
                            if (status) {
                                console.log("changing");
                                await User.findByIdAndUpdate(
                                    {
                                        _id: user._id,
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
            catch (err) {
                resolve(false);
            }
        });
    },

    getuser: (user) => {
        return new Promise(async (resolve, reject) => {
            const userdata = await User.findOne({ _id: user });

            if (userdata == null) {
                resolve(false);

            }
            else {
                resolve(userdata);
            }
        });
    },

    addevent: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const event = await Event.create({
                    user: user,
                    start: data['start'],
                    title: data['title']
                })
                resolve(true)
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    getevents: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const events = await Event.find({ user: user }, { _id: 0, createdAt: 0, updatedAt: 0, user: 0, __v: 0 });
                resolve(events);
            }
            catch (err) {
                resolve(false);
            }
        });
    },

    getreminder: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const currentDate = new Date();
                const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd');

                const sevenDaysLater = addDays(currentDate, 7);
                const formattedSevenDaysLater = format(sevenDaysLater, 'yyyy-MM-dd');

                const events = await Event.find({
                    user: user,
                    start: {
                        $gte: formattedCurrentDate,
                        $lt: formattedSevenDaysLater
                    }
                }, { _id: 0, createdAt: 0, updatedAt: 0, user: 0, __v: 0 });

                resolve(events);
            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        })
    }

}