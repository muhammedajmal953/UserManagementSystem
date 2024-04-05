const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String },
  password:{type: String,},
  email: { type: String, unique: true },
  gender: String,
  status: String,
});

const Userdb = mongoose.model("userdb", schema);



module.exports = Userdb