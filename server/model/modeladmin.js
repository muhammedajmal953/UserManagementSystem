const mongoose = require("mongoose");

const schema1 = new mongoose.Schema({
  name: { type: String },
  password: { type: String },
});

const admin = mongoose.model("admins", schema1);

module.exports = admin