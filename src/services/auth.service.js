"use strict";

const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
// const User = require('./db/models/user.model');

const jwtSecret = process.env.JWT_SECRET;
const signOptions = { expiresIn: '30d', };
const generateToken = (user) => {
  const payLoad = { _id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin, };
  // console.log('genToken payLoad.username: '); console.log(payLoad.username);
  return jwt.sign(payLoad, jwtSecret, signOptions);
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(' ')[1]; // Bearer XXXXXX
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode;
    // console.log(`isAuth req.user: `); console.log(req.user);
    next();
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

module.exports = { generateToken, isAuth, isAdmin };
