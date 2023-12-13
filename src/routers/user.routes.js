"use strict";

const dotenv =  require('dotenv');
dotenv.config();
const express = require('express');
const { isAdmin, isAuth } = require('../services/auth');
const userContr = require('../controller/user.controller');

const userRoute = express.Router();

userRoute.get( '/', isAuth, isAdmin, userContr.getAllUsers);
userRoute.get( '/:id', userContr.getUser);
userRoute.post( '/register', userContr.registerUser);
userRoute.post( '/login', userContr.login);

userRoute.put( '/update-profile', isAuth, userContr.updateProfile);
userRoute.put( '/:id', isAuth, isAdmin, userContr.editUser);
userRoute.delete( '/:id', isAuth, isAdmin, userContr.deleteUser);

module.exports = userRoute;
