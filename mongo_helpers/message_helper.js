const Guardian = require("../models/guardianmodel");
const Student = require("../models/studentmodel");
const Payment = require("../models/paymentmodel");
const mailgunTransport = require('nodemailer-mailgun-transport');

const { Client } = require('whatsapp-web.js');



const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'sreekrishnaacadmey@gmail.com',
        pass: 'SreeKrishnaAcademy#01123'
    }
});




module.exports = {
    initate: () => {
        return new Promise(async (resolve, reject) => {
            let qrcode;
            client.on('qr', (qr) => {
                // Generate and scan this code with your phone
                console.log('QR RECEIVED', qr);
                qrcode = qr;
            });

            resolve(qrcode);
        });
    },

    sendmessage: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {


                var list = data['adminNo'];

                


                
                var list = data['adminNo'];

                console.log("list : " + list);

                // Convert the elements of list to strings
                var stringList = list.map(String);

                console.log(stringList);
                // Assuming user is defined
                const guardian = await Guardian.find({ user: user });

                // Filter the guardians whose student values are in the stringList
                const filteredGuardians = guardian.filter(g => stringList.includes(String(g.student)));

                console.log(filteredGuardians);

                // Extract the WhatsApp numbers from the filtered guardians
                const whatsappNumbers = filteredGuardians.map(g => g.email);

                console.log(whatsappNumbers)

                const auth = {
                    auth: {
                        api_key: 'b1bc833bcfeee6bb8b2dfd6b9acab345-5465e583-87464064', // replace with your Mailgun API key
                        domain: 'sandbox01d5ebf5d3c6428f9103eda889d41dbf.mailgun.org' // replace with your Mailgun domain
                    }
                };
                const nodemailerMailgun = nodemailer.createTransport(mailgunTransport(auth));
                
                


                for (i = 0; i < whatsappNumbers.length; i++) {
                    let mailOptions = {
                        from: 'sreekrishnaacadmey@gmail.com',
                        to: whatsappNumbers[i],
                        subject: 'Reminder or Message',
                        html: `${data['message']}`
                    };
                
                    nodemailerMailgun.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent:');
                        }
                    });


                }

                resolve(true);
            }
            catch (e) {
                console.log(e)
                resolve(false);
            }
        });
    },

    getwatchlist: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const students = await Student.find({ user: user, attendance: { $lt: 30 } });
                const guardian = await Guardian.find({user:user}); 

                resolve([students,guardian]);
            }
            catch (err) {
                console.log(err);
                resolve(false);
            }
        });
    },

    getstarred: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const students = await Student.find({ user: user, star: true });
                const guardian = await Guardian.find({user:user}); 

                resolve([students,guardian]);
            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        });
    },

    getduestu: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const studentsWithUser = await Student.find({ user: user });
                const guardian = await Guardian.find({user:user});
                

                // Extract admission numbers from the first query
                const admissionNumbers = studentsWithUser.map(student => student.adminNo);

                // Find students with a balance greater than 0 in the Payment model
                const studentsWithPositiveBalance = await Payment.find({ student: { $in: admissionNumbers }, balance: { $gt: 0 } });

                // Extract admission numbers with a positive balance
                const admissionNumbersWithPositiveBalance = studentsWithPositiveBalance.map(payment => payment.student);

                // Find the student names based on admission numbers with a positive balance
                const studentsWithPositiveBalanceAndNames = await Student.find({ adminNo: { $in: admissionNumbersWithPositiveBalance } });

                resolve([studentsWithPositiveBalanceAndNames,guardian]);

            }
            catch (err) {
                console.log(err);
                resolve(null);
            }
        });
    },



}