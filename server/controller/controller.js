const session = require("express-session");
const model = require("../model/modeladmin");
const Userdb = require("../model/model")
const { set } = require("mongoose");
const cookieParser = require('cookie-parser');


// const user = "admin@gmail.com";
// const pass = "qwerty123";

const admin  = model;

exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  const admins = await admin.findOne();
  if (email == admins.name && password == admins.password) {
    req.session.isAuth = true;
    req.session.username = admins.name;
    res.cookie(req.session.isAuth,{maxAge : 20000})
    res.redirect("/admin/users");
  } else {
    req.session.error = "Invalid Credentials";
    return res.redirect("/admin");
  }
};

//create and save new user
exports.create = (req, res) => {
  //validate request

  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty !" });
    return;
  }
  //new user
  const user = new Userdb({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
    status: req.body.status,
  });

  //save user in database
  user
    .save(user)
    .then((data) => {
      res.render("Admin/adduser", { success: "User added" });
    })
    .catch((err) => {
      if (err) {
        res.render("Admin/adduser", { message: "User already exists" });
      }
    });
};

//retrieve and return users
exports.find = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;
    Userdb.findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found user with id" + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: `Error retrieving user with id ${id}` });
      });
  } else {
    Userdb.find()
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Error occured while retrieving user information",
        });
      });
  }
};
//update a new identified user by id
exports.update = (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .send({ message: "Data to be updated shouldn't be empty" });
  }

  const id = req.params.id;
  Userdb.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    password:req.body.password,
    gender: req.body.gender,
    status: req.body.status,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update user with ${id}. May be user not found `,
        });
      } else {
        res.redirect("/admin/users");
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Updating user information" });
    });
};
//delete user
exports.delete = (req, res) => {
  const id = req.params.id;
  Userdb.findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot delete with id ${id} May be id is wrong` });
      } else {
        res.send({ message: "User deleted successfully" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: `Could not delete User with id ${id}` });
    });
};

exports.logout_post = (req, res) => {
  res.clearCookie(req.session.isAuth)
  req.session.destroy((err) => {
    if (err) {
      throw err;
    }
    res.redirect("/admin");
  });
};
