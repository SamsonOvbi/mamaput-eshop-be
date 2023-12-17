"use strict";

const dotenv =  require('dotenv');
dotenv.config();
const express = require('express');
const { isAdmin, isAuth } = require('../services/auth');
const userContr = require('../controller/user.controller');

const authRoute = express.Router();

authRoute.post( '/register', userContr.registerUser);
authRoute.post( '/login', userContr.login);

module.exports = authRoute;
