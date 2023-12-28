var express = require('express');
var router = express.Router();

const wbm = require('wbm');

const {
  addcourse,
  updatecourse,
  getcourses,
} = require('../mongo_helpers/course_helper');

const {
  createuser,
  updatepassword,
  verifyuser,
  updateuser,
  getuser,
  addevent,
  getevents,
  getreminder,
} = require('../mongo_helpers/user_helper');

const {
  getstudentsforattendance, addattendance, getstudattendancedetail, addteacherattendance,
} = require("../mongo_helpers/attendance_helper");

const { addguardian, updateguardian } = require('../mongo_helpers/guardian_helper');

const {
  addstucourse,
  addstudent,
  changestar,
  changewatchlist,
  delcourse,
  getstudent,
  updateattendance,
  updatestudent,
  getstudents,
  addstupayment,
} = require("../mongo_helpers/student_helper");

const { addteacher, getteacherattendance } = require("../mongo_helpers/teacher_helper");
const { getawards, getawards2, addEventdata, addMultiData, addNewEvent, addMultidata2, addEventdata2 } = require('../mongo_helpers/award_helper');
const { getchartdata } = require('../mongo_helpers/dashboard_helper');
const { sendmessage, getwatchlist, getstarred } = require('../mongo_helpers/message_helper');


/* GET home page. */
router.get('/', function (req, res) {
  if (req.session.login == true) {
    res.redirect("/dashboard");
  }
  else {
    res.render('index');
  }
});

router.post("/login", (req, res) => {
  console.log(req.body)
  verifyuser(req.body).then((response) => {
    if (response != false) {
      req.session.login = true;
      req.session.user = response._id;
      res.redirect("/dashboard");
    }
    else {
      res.redirect('/');
    }
  });
});

router.post("/register", (req, res) => {
  createuser(req.body).then((response) => {
    if (response == false) {
      res.redirect("/");
    }
    else {
      console.log("registered");
      res.redirect("/")
    }
  });
});

router.get("/dashboard", (req, res) => {
  if (req.session.login == true) {
    getchartdata(req.session.user).then((response) => {
      console.log(response)
      res.render('dashboard', { dashboard: true, increase: response[0], currentrev: response[1], Attendance: response[2], attendval: response[3], current: JSON.stringify(response[4]), prev: JSON.stringify(response[5]), Courses: JSON.stringify(response[6]), due: response[7] })
    });
  }
  else {
    res.redirect('/');
  }
});

router.get("/profile", (req, res) => {
  if (req.session.login == true) {
    getuser(req.session.user).then((response) => {
      if (response == false) {
        res.redirect("/");
      }
      else {
        res.render("dashboard", { profile: true, data: response });
      }
    });
  }
  else {
    res.redirect('/');
  }
});

router.post("/updateprofile", (req, res) => {
  if (req.session.login == true) {
    updateuser(req.body).then((response) => {
      if (response == false) {
        console.log("failed")
        res.redirect("/profile");
      }
      else {
        res.redirect("/profile");
      }
    });
  }
  else {
    res.redirect("/");
  }
});

router.post("/changepss", (req, res) => {
  if (req.session.login == true) {
    updatepassword(req.body).then((response) => {
      if (response == false) {
        res.redirect("/profile");
      }
      else {
        res.redirect("/profile");
      }
    });
  }
  else {
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.login = false;
  res.redirect("/");
});

router.get("/attendance", (req, res) => {
  if (req.session.login == true) {
    getcourses(req.session.user).then((response) => {
      //console.log(response)
      res.render("dashboard", { attendance: true, data: response });
    });

  }
  else {
    res.redirect("/");
  }
});

router.get("/calendar", (req, res) => {
  if (req.session.login == true) {
    getevents(req.session.user).then((response) => {
      if (response == false) {
        res.render("dashboard", { calendar: true });
      }
      else {
        res.render("dashboard", { calendar: true, data: response });
      }
    })

  }
  else {
    res.redirect("/");
  }
});

router.get("/cultural", (req, res) => {
  if (req.session.login == true) {
    res.render("dashboard", { cultural: true });
  }
  else {
    res.redirect("/");
  }
});

router.get("/students", (req, res) => {
  if (req.session.login == true) {
    getstudents(req.session.user).then((response) => {
      if (response == false) {
        res.render("dashboard", { students: true })
      }
      else {
        res.render("dashboard", { students: true, data: response })
      }
    });

  }
  else {
    res.redirect("/");
  }
});

router.post("/addcourse", (req, res) => {
  if (req.session.login == true) {
    //console.log(req.body);
    addcourse(req.session.user, req.body).then((response) => {
      res.redirect("/attendance");
    });
  }
  else {
    res.redirect("/");
  }
});

router.get("/takeattendance", (req, res) => {
  if (req.session.login == true) {
    let course = req.query.name;
    getstudentsforattendance(req.session.user, course).then((response) => {
      res.render("dashboard", { takeattendance: true, data: response, cname: course });
    });

  }
  else {
    res.redirect("/");
  }
});

router.get("/teachers", (req, res) => {
  if (req.session.login == true) {
    res.render("dashboard", { teachers: true });
  }
  else {
    res.redirect("/");
  }
});

router.get("/lists", (req, res) => {
  if (req.session.login == true) {
    res.render("dashboard", { lists: true });
  }
  else {
    res.redirect("/");
  }
});

router.get("/message", (req, res) => {
  if (req.session.login == true) {
    getwatchlist(req.session.user).then((response)=>{
      res.render("dashboard", { message: true,data : response });
    });
    
  }
  else {
    res.redirect("/");
  }
});

router.get("/starred",(req,res)=>{
  if(req.session.login==true){
    getstarred(req.session.user).then((response)=>{
      res.render("dashboard",{message:true,data:response});
    });
  }
  else{
    res.redirect("/");
  }
})

router.get("/addstudent", (req, res) => {
  if (req.session.login == true) {
    getcourses(req.session.user).then((response) => {
      console.log(response);
      res.render("dashboard", { addstudent: true, data: response })
    });

  }
  else {
    res.redirect("/");
  }
});

router.post("/addstudent", (req, res) => {
  addstudent(req.session.user, req.body).then((response) => {
    if (response == false) {
      res.json({ status: false });
    }
    else {
      res.json({ status: true });
    }
  });

});


router.post("/addguardian", (req, res) => {
  addguardian(req.session.user, req.body).then((response) => {
    if (response == false) {
      res.json({ status: false });
    }
    else {
      res.json({ status: true });
    }
  });
});

router.post("/addpayment", (req, res) => {
  console.log(req.body);
  res.json({ status: true });

});

router.post("/addstucourse", (req, res) => {
  addstucourse(req.session.user, req.body).then((response) => {
    if (response == false) {
      res.json({ status: false });
    }
    else {
      res.json({ status: true });
    }
  });

});


router.get("/updatestudent", (req, res) => {
  if (req.session.login == true) {
    console.log(req.query.id)
    getstudent(req.session.user, req.query.id).then((response) => {
      console.log(response)
      if (response != false) {
        res.render("dashboard", { updatestudent: true, student: response[0], guardian: response[1], enroll: response[2], prev: response[3], courses: response[4], pay: response[5] });
      }
      else {
        res.redirect("/students");
      }
    });

  }
  else {
    res.redirect("/");
  }
});

router.post("/addstupayment", (req, res) => {
  if (req.session.login == true) {
    addstupayment(req.session.user, req.body).then((response) => {
      //console.log(response)
      res.json({ status: response });
    });
  }

});

router.post("/updateguardian", (req, res) => {
  updateguardian(req.session.user, req.body).then((response) => {

    res.json({ status: response });
  });
});

router.post("/addattendance", (req, res) => {
  if (req.session.login == true) {
    addattendance(req.session.user, req.body).then((response) => {
      console.log(response);
      res.redirect("/attendance");
    });
  }
  else {
    res.redirect("/");
  }
});

router.get("/detailedview", (req, res) => {
  if (req.session.login == true) {
    getstudattendancedetail(req.session.user, req.query.id).then((response) => {
      if (response == false) {
        res.redirect('/students');
      }
      else {
        res.render("dashboard", { detailed: true, data: response });
      }
    });
  }
  else {
    res.redirect('/');
  }
});

router.post("/addteacher", (req, res) => {
  if (req.session.login == true) {
    addteacher(req.session.user, req.body).then((response) => {
      res.redirect('/teachers');
    });
  }
  else {
    res.redirect('/');
  }
});

router.post("/addteacherattendance", (req, res) => {
  if (req.session.user == true) {
    addteacherattendance(req.session.user, req.body).then((response) => {
      res.redirect("/teachers");
    });
  }
  else {
    res.redirect('/');
  }
});

router.get("/detailedteacherview", (req, res) => {
  if (req.session.user == true) {
    getteacherattendance(req.session.user, req.query.id).then((response) => {
      res.render("dashboard", { detailed: true, data: JSON.stringify(response) });
    });
  }
  else {
    res.redirect("/");
  }
});


router.post('/addevent', (req, res) => {
  if (req.session.login == true) {
    addevent(req.session.user, req.body).then((response) => {
      res.redirect("/calendar");
    });
  }
  else {
    res.redirect('/');
  }
});

router.get("/reminders", (req, res) => {
  if (req.session.login == true) {
    getreminder(req.session.user).then((response) => {
      console.log(response)
      if (response == false) {
        res.json({ data: [] })
      }
      else {
        res.json({ data: response });
      }
    });
  }
  else {
    res.redirect("/");
  }
});

router.get("/awards", (req, res) => {
  if (req.session.login == true) {
    getawards(req.session.user, req.query.name).then((response) => {
      res.render("dashboard", { cultural: true, data: response, event: req.query.name });
    });
  }
  else {
    res.redirect('/');
  }
});

router.get("/award2", (req, res) => {
  if (req.session.login == true) {
    getawards2(req.session.user).then((response) => {
      res.render("dashboard", { award2: true, data: response, event: "2" });
    });
  }
  else {
    res.redirect('/');
  }
});

router.post("/addaward", (req, res) => {
  if (req.session.login == true) {
    //console.log(req.body);
    if (Array.isArray(req.body["date"])) {
      addMultiData(req.session.user, req.body['event'], req.body).then((response) => {
        res.redirect("/awards?name=" + req.body['event']);
      });
    }
    else {
      addEventdata(req.session.user, req.body['event'], req.body).then((response) => {
        res.redirect("/awards?name=" + req.body['event']);
      });
    }
  }
  else {
    res.redirect('/');
  }
});

router.post("/addaward2", (req, res) => {
  if (req.session.login == true) {
    if (Array.isArray(req.body["date"])) {
      addMultidata2(req.session.user, req.body).then((response) => {
        res.redirect("/award2");
      });
    }
    else {
      addEventdata2(req.session.user, req.body).then((response) => {
        res.redirect("/award2");
      });
    }
  }
  else {
    res.redirect("/");
  }
});

router.post("/addNewEvent", (req, res) => {
  if (req.session.user == true) {
    addNewEvent(req.session.user, req.body['event']).then((response) => {
      res.redirect("/cultural");
    });
  }
  else {
    res.redirect("/");
  }
});


router.post("/sendmessage", async (req, res) => {
  if (req.session.login == true) {
   sendmessage(req.body['no'],req.body['message']).then((response)=>{
    res.redirect("/message");
   });
  }
  else {
    res.redirect('/');
  }
});


module.exports = router;
