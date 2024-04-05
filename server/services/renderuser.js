const Userdb = require("../model/model");
const bcrypt = require('bcrypt');
const user = Userdb

exports.login = (req,res)=>{res.render('User/login')}


exports.signup = (req, res) => {res.render("User/signup");}
exports.home = async (req, res) => {
  res.set("Cache-Control", "no-store");
 try{ if (req.session.user) {
    const userdata = await Userdb.findOne({email:req.session.user});
    res.render("User/home",{user:userdata});
  }} catch (err) {
    res.render("User/login",{err: 'User destroyed'});
  }
}