const Guardian = require("../models/guardianmodel");
const Student = require("../models/studentmodel");
const Payment = require("../models/paymentmodel");


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


                for (i = 0; i < whatsappNumbers.length; i++) {
                    let mailDetails = {
                        from: 'sreekrishnaacadmey@gmail.com',
                        to: whatsappNumbers[i],
                        subject: 'Reminder',
                        text: data['message'],
                    };

                    await transporter.sendMail(mailDetails, function (err, data) {
                        if (err) {
                            console.log(err);
                            console.log('Error Occurs');
                        } else {
                            console.log('Email sent successfully');
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

                resolve(students);
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

                resolve(students);
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

                // Extract admission numbers from the first query
                const admissionNumbers = studentsWithUser.map(student => student.adminNo);

                // Find students with a balance greater than 0 in the Payment model
                const studentsWithPositiveBalance = await Payment.find({ student: { $in: admissionNumbers }, balance: { $gt: 0 } });

                // Extract admission numbers with a positive balance
                const admissionNumbersWithPositiveBalance = studentsWithPositiveBalance.map(payment => payment.student);

                // Find the student names based on admission numbers with a positive balance
                const studentsWithPositiveBalanceAndNames = await Student.find({ adminNo: { $in: admissionNumbersWithPositiveBalance } });

                resolve(studentsWithPositiveBalanceAndNames);

            }
            catch (err) {
                console.log(err);
                resolve(null);
            }
        });
    },



}