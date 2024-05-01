"use strict";

const dotenv =  require('dotenv');
dotenv.config();
const express = require('express');
const { isAdmin, isAuth } = require('../services/auth.service');
const userContr = require('../controller/user.controller');

const userRoute = express.Router();

userRoute.get( '/', isAuth, isAdmin, userContr.getAllUsers);
userRoute.get('/test', userContr.testApi);
userRoute.get( '/:id', userContr.getUser);

userRoute.put( '/:id', isAuth, isAdmin, userContr.editUser);
userRoute.delete( '/:id', isAuth, isAdmin, userContr.deleteUser);

module.exports = userRoute;
