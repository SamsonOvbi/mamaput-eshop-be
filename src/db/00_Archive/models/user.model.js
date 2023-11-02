'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, required: true },
  role: { type: String }
});

const UserModel = mongoose.model ( 'user', userSchema ) ;
module.exports = UserModel;
