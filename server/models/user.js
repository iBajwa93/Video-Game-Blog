const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //adminStatus field controls whether a signed up user has administrator priviledges
  //(such as: deleting other users, edit/update stories, submit stories)
  adminStatus: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
