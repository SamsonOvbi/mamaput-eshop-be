"use strict";

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true, unique: true },
  rating: { type: Number, required: true, default: 0 },
  bootcamp: { type: String, required: true },
  user: { type: Boolean, required: true, default: false },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel;
