const express = require("express");
const router = express.Router();
const Userdb = require("../model/model");
// const bcrypt = require('bcrypt');
const user = Userdb
const session = require("express-session");
const service = require("../services/renderuser");
const controller = require("../controller/controlleruser"); 

const dotenv = require("dotenv");
const connectDB = require("../database/connection");
const MongoDBStore = require("connect-mongodb-session")(session);
const { v4: uuidv4 } = require("uuid");
dotenv.config({ path: "config.env" });


const ustore = new MongoDBStore({
  uri: connectDB.mongoURI,
  collection: "userSessions",
});

router.use(
  session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true,
    store: ustore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// login
router.get('/',service.login)
//signup
router.get("/signup",service.signup);
router.get("/home",service.home);

//logout where session is dstroyed
router.post("/logout", (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
      res.send("Error");
    } else {
      res.render("User/login");
    }
  });
});

router.post("/login", async (req, res) => {
  try {
    const user = await Userdb.findOne({ name: req.body.name });
    if  (user.name) {
      // const isValid = await bcrypt.compare(req.body.password,user.password)
      if (req.body.password==user.password) {
        req.session.user = user.email;
        res.redirect("/user/home");
      } 
      else {
        res.render("User/login",{error:"Incorrect password"});
      }
    }
  } 
  catch (error) {
    // send an error response to the client.
    res.render("User/login",{error:"Incorrect username"});
  }
});


router.post("/signup",checkuser, async (req, res) => {
  // const hash = await bcrypt.hash(req.body.password,5)
  const data = new user({
    name: req.body.name,
    password:req.body.password,
    email: req.body.email,
    gender: req.body.gender,
    status: req.body.status
  });
  console.log(data);
  //insert data to database
  await data.save([data]);
  req.session.user = data.email;
  console.log(data);
  res.redirect("/user");
});

//middleware to check whether data exists in the database
async function checkuser(req, res, next) {
  try {
    const resultname = await Userdb.findOne(
      { name: req.body.name },
      { name: 1, _id: 0 }
    );
    const resultemail = await Userdb.findOne(
      { email: req.body.email },
      { email: 1, _id: 0 }
    );
    if (req.body.name && req.body.name.startsWith(' ')){
      res.render("User/signup", { exists: "User name cannot starts with blank space" });
    }
    else if (req.body.password && req.body.password.includes(' ')){
      res.render("User/signup", { exists: "Password cannot contain blank spaces" });
    }
     else if (resultemail) {
      res.render("User/signup", { exists: "Email already Registered please login" });
    }
    else  if (resultname) {
      res.render("User/signup", { exists: "User name exists" });
    }
    
     else {
      // res.render('signup',{exists:'Signup successfull please login again'})
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

//home page with session


module.exports = router