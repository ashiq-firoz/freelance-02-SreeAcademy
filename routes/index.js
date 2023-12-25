var express = require('express');
var router = express.Router();

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
} = require('../mongo_helpers/user_helper');

const {

} = require("../mongo_helpers/attendance_helper");

const {

} = require('../mongo_helpers/guardian_helper');

const {

} = require("../mongo_helpers/student_helper");

const {

} = require("../mongo_helpers/teacher_helper");


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
      res.render("dashboard");
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
    res.render('dashboard')
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

router.post("/changepss",(req,res)=>{
  if(req.session.login==true){
    updatepassword(req.body).then((response)=>{
      if(response==false){
        res.redirect("/profile");
      }
      else{
        res.redirect("/profile");
      }
    });
  }
  else{
    res.redirect("/");
  }
});

router.get("/logout",(req,res)=>{
  req.session.login = false;
  res.redirect("/");
});

router.get("/attendance",(req,res)=>{
  if(req.session.login==true){
    getcourses(req.session.user).then((response)=>{
      //console.log(response)
      res.render("dashboard",{attendance:true,data:response});
    });
    
  }
  else{
    res.redirect("/");
  }
});

router.get("/calendar",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{calendar:true});
  }
  else{
    res.redirect("/");
  }
});

router.get("/cultural",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{cultural:true});
  }
  else{
    res.redirect("/");
  }
});

router.get("/students",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{students:true})
  }
  else{
    res.redirect("/");
  }
});

router.post("/addcourse",(req,res)=>{
  if(req.session.login==true){
    //console.log(req.body);
    addcourse(req.session.user,req.body).then((response)=>{
        res.redirect("/attendance");
    });
  }
  else{
    res.redirect("/");
  }
});

router.get("/takeattendance",(req,res)=>{
  if(req.session.login==true){
    let course = req.query.name;

  }
  else{
    res.redirect("/");
  }
});

router.get("/teachers",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{teachers:true});
  }
  else{
    res.redirect("/");
  }
});

router.get("/lists",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{lists:true});
  }
  else{
    res.redirect("/");
  }
});

router.get("/message",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{message:true});
  }
  else{
    res.redirect("/");
  }
});

router.get("/addstudent",(req,res)=>{
  if(req.session.login==true){
    getcourses(req.session.user).then((response)=>{
      console.log(response);
      res.render("dashboard",{addstudent:true,data:response})
    });
    
  }
  else{
    res.redirect("/");
  }
});

router.post("/addstudent",(req,res)=>{
  console.log(req.body);
  res.json({status:true});
});


router.post("/addguardian",(req,res)=>{
  console.log(req.body);
  res.json({status:true});

});

router.post("/addpayment",(req,res)=>{
  console.log(req.body);
  res.json({status:true});

});

router.post("/addstucourse",(req,res)=>{
  console.log(req.body);
  res.json({status:true});

});


router.get("/updatestudent",(req,res)=>{
  if(req.session.login==true){
    res.render("dashboard",{updatestudent:true});
  }
  else{
    res.redirect("/");
  }
});

router.post("/addpayment",(req,res)=>{
  console.log(req.body);
  res.json({status:true});
});



module.exports = router;
