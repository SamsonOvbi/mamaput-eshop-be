"use strict";

const mongoose = require("mongoose");

var UserModel = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

// export const UserModel = getModelForClass(User);
module.exports = UserModel;
