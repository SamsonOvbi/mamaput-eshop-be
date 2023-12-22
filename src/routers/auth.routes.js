"use strict";

const dotenv =  require('dotenv');
dotenv.config();
const express = require('express');
const { isAuth } = require('../services/auth');
const authContr = require('../controller/auth.controller');

const authRoute = express.Router();

authRoute.post( '/register', authContr.registerUser);
authRoute.post( '/login', authContr.login);
authRoute.put( '/update-profile', isAuth, authContr.updateProfile);

module.exports = authRoute;
