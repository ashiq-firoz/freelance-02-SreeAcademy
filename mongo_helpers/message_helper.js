const Guardian = require("../models/guardianmodel");
const Student = require("../models/studentmodel");
const Payment = require("../models/paymentmodel");
const mailgunTransport = require('nodemailer-mailgun-transport');

const { Client } = require('whatsapp-web.js');

// Import required AWS SDK modules for SNS (Simple Notification Service)
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const nodemailer = require('nodemailer');

// Asynchronous function to send an SMS message using AWS SNS
async function sendSMSMessage(sns, params) {
    // Create a new PublishCommand with the specified parameters
    const command = new PublishCommand(params);

    // Send the SMS message using the SNS client and the created command
    const message = await sns.send(command);

    // Return the result of the message sending operation
    return message;
}

// Create an SNS client with the specified configuration
const sns = new SNSClient({
    region: "ap-south-1", // AWS region from environment variables
    credentials: {
        accessKeyId: "AKIAZR2BRYAJMMGW5JC4", // AWS access key from environment variables
        secretAccessKey: "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" // AWS secret key from environment variables
    }
});

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

    sendSMS: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {

                var list = data['adminNo'];

                console.log("list : " + list);




                for (i = 0; i < list.length; i++) {
                    // Define parameters for the SMS message
                    var params = {
                        Message: data['message']+"\n \nFrom Sree Krishna Natya Sangeetha Academy\n",
                        PhoneNumber: '91' + list[i], // Recipient's phone number from environment variables
                        MessageAttributes: {
                            'AWS.SNS.SMS.SenderID': {
                                'DataType': 'String',
                                'StringValue': 'String'
                            }
                        }
                    };
                    //Create a new PublishCommand with the specified parameters
                    const command = new PublishCommand(params);

                    // Send the SMS message using the SNS client and the created command
                    const message = await sns.send(command);
                    console.log("response :")
                    console.log(message);

                }
                resolve(true);

            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        });
    },

    sendmessage: (user, data) => {
        return new Promise(async (resolve, reject) => {
            try {

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
                const guardian = await Guardian.find({ user: user });

                resolve([students, guardian]);
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
                const guardian = await Guardian.find({ user: user });

                resolve([students, guardian]);
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
                const guardian = await Guardian.find({ user: user });


                // Extract admission numbers from the first query
                const admissionNumbers = studentsWithUser.map(student => student.adminNo);

                // Find students with a balance greater than 0 in the Payment model
                const studentsWithPositiveBalance = await Payment.find({ student: { $in: admissionNumbers }, balance: { $gt: 0 } });

                // Extract admission numbers with a positive balance
                const admissionNumbersWithPositiveBalance = studentsWithPositiveBalance.map(payment => payment.student);

                // Find the student names based on admission numbers with a positive balance
                const studentsWithPositiveBalanceAndNames = await Student.find({ adminNo: { $in: admissionNumbersWithPositiveBalance } });

                resolve([studentsWithPositiveBalanceAndNames, guardian]);

            }
            catch (err) {
                console.log(err);
                resolve(null);
            }
        });
    },



}