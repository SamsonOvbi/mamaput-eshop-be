"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel;
