const Attendance = require("../models/attendancemodel");
const Course = require("../models/coursemodel");
const Default = require("../models/keepRecord");

module.exports = {
    getchartdata: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                const cou = await Course.find({ user: user });

                const courses = cou.map(entry => entry.name);

                //console.log(courses);

                let attendance = [];
                let attendval  = [];

                let current = []; //current attentdance
                let prev = [];

                for (i = 0; i < courses.length; i++) {
                    let dates = await Attendance.distinct("date", { course: courses[i] });
                    // Get the current date
                    let currentDate = new Date();
                    let val = 0;

                    // Filter dates for the current date
                    const currentDateCount = dates.filter(date => {
                        const dateObject = new Date(date);
                        return dateObject.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
                    }).length;

                    // Filter dates for the current month
                    let datesInCurrentMonth = dates.filter(date => {
                        let dateObject = new Date(date);
                        return dateObject.getMonth() === currentDate.getMonth() && dateObject.getFullYear() === currentDate.getFullYear();
                    });

                    // Get the first day of the current month
                    let firstDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

                    // Get the last day of the previous month
                    let lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

                    // Filter dates for the previous month
                    let datesInPrevMonth = dates.filter(date => {
                        let dateObject = new Date(date);
                        return dateObject >= firstDayOfPrevMonth && dateObject <= lastDayOfPrevMonth;
                    });

                    // Get the count of dates in the current month and previous month
                    let countInCurrentMonth = datesInCurrentMonth.length;
                    let countInPrevMonth = datesInPrevMonth.length;

                    const currenttotal = countInCurrentMonth;
                    const prevtotal = countInPrevMonth;

                    dates = await Attendance.distinct("date", { course: courses[i], present: true });
                    //console.log(dates);
                    // Get the current date
                    currentDate = new Date();


                    // Filter dates for the current date
                    const currentDatePresentCount = dates.filter(date => {
                        const dateObject = new Date(date);
                        return dateObject.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0];
                    }).length;

                    // Filter dates for the current month
                    datesInCurrentMonth = dates.filter(date => {
                        dateObject = new Date(date);
                        return dateObject.getMonth() === currentDate.getMonth() && dateObject.getFullYear() === currentDate.getFullYear();
                    });

                    // Get the first day of the current month
                    firstDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

                    // Get the last day of the previous month
                    lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

                    // Filter dates for the previous month
                    datesInPrevMonth = dates.filter(date => {
                        dateObject = new Date(date);
                        return dateObject >= firstDayOfPrevMonth && dateObject <= lastDayOfPrevMonth;
                    });

                    // Get the count of dates in the current month and previous month
                    countInCurrentMonth = datesInCurrentMonth.length;
                    countInPrevMonth = datesInPrevMonth.length;
                    
                    if(currenttotal==0){
                        val = 0
                    }
                    else{
                        val = (countInCurrentMonth / currenttotal) * 100
                    }
                    const currentattend = val;

                    if(prevtotal==0){
                        val = 0;
                    }
                    else{
                        val = (countInPrevMonth / prevtotal) * 100
                    }
                    const prevattendance = val;

                    current.push(currentattend);
                    prev.push(prevattendance);

                    console.log(currentDatePresentCount)
                    console.log(currentDateCount)
                    
                    if(currentDateCount==0){
                        val = 0
                    }          
                    else{
                        val = (currentDatePresentCount/currentDateCount)*100
                    }          

                    attendance.push(val);

                    attendval.push(currentDatePresentCount+"/"+currentDateCount);

                }

                const prevrev  = await Default.findOne({user:user});

                let increase = (prevrev.thismonth - prevrev.prevmonth)

                if(prevrev.prevmonth==0){
                    increase = "+ 0 %"
                }
                else if(increase<0){
                    increase = "-"+(Math.abs(increase)/(prevrev.prevmonth)*100)+" %";
                }
                else{
                     increase = "+" + ((increase/prevrev.prevmonth)*100) + " %";
                }

                resolve([increase,prevrev.thismonth,attendance,attendval,current,prev,courses,prevrev.totaldue]);

            }
            catch (err) {
                console.log(err)
                resolve(false);
            }
        });
    }
}