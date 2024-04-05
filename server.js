const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./server/database/connection");
const nodemon = require("nodemon");
const nocache = require("nocache");



//log requests
app.use(morgan("tiny"));
app.use(nocache())
//parse
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 

//load routers
app.use("/user", require("./server/routes/router"));
app.use("/admin", require("./server/routes/adminrouter"));

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 5000;

//mongodb connection
connectDB();
//set view engine
app.set("view engine", "ejs");
//load assets
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/img", express.static(path.resolve(__dirname, "assets/img")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));



app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/user`);
});
