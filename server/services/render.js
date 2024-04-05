const axios = require("axios");


exports.loginRoute = (req, res) => {
  const error = req.session.error;
  delete req.session.error;
  res.render("Admin/login", { err: error });
};

exports.homeRoutes = (req, res) => {
  //Make a get request to api/users
  axios
    .get("http://localhost:5000/admin/api/users")
    .then(function (response) {
      res.render("Admin/index", { users: response.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.adduser = (req, res) => {
  res.render("Admin/adduser");
};

exports.updateuser = (req, res) => {
  axios
    .get("http://localhost:5000/admin/api/users", { params: { id: req.query.id } })
    .then(function (userdata) {
      res.render("Admin/updateuser", { user: userdata.data });
    })
    .catch((err) => {
      // res.send(err);
    });
};


