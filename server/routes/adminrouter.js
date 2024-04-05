const express = require("express");
const route = express.Router();
const session = require("express-session");
const dotenv = require("dotenv");
const connectDB = require("../database/connection");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require("uuid");
dotenv.config({ path: "config.env" });


const store = new MongoDBStore({
  uri: connectDB.mongoURI,
  collection: "adminSessions",
});
route.use(cookieParser())
route.use(
  session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);
const service = require("../services/render");
const controller = require("../controller/controller");


route.get("/", service.loginRoute)
route.get("/users", isAuth, service.homeRoutes);
route.get("/adduser", isAuth, service.adduser);
route.get("/updateuser", isAuth, service.updateuser);


route.post("/users", controller.login_post);
route.post("/logout", controller.logout_post);

//API
route.post("/api/users", controller.create);
route.get("/api/users", controller.find);
route.post("/api/users/:id", controller.update);
route.delete("/api/users/:id", controller.delete);

//Middleware
function isAuth(req, res, next) {
  res.set("Cache-Control", "no-store");
  if (req.session.isAuth) {
    next();
  } else {
    req.session.error = "You have to Login first";
    res.redirect("/admin");
  }
}
module.exports = route;
