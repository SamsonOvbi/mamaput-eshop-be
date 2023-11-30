"use strict";

const mongoose = require("mongoose");


const addressSchema = new mongoose.Schema({
  city: { type: String, },
  street: { type: String, },
  number: { type: Number, },
  zipcode: { type: String, },
  geolocation: {
    lat: { type: String, },
    long: { type: String, },
  },
}, { timeStamps: true });

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: {
    firstname: { type: String, },
    lastname: { type: String, },
  },
  isAdmin: { type: Boolean, required: true, default: false },
  address: [addressSchema],
  phone: { type: String, required: true, default: '' },
}, { timeStamps: true });

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel;
