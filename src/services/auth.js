"use strict";

const dotenv =  require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
// const User = require('./db/models/user.model');

const jwtSecret = process.env.JWT_SECRET;
const generateToken = (user) => {
  const payLoad = {_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,};
  const signOptions = {expiresIn: '30d',};
  return jwt.sign(payLoad, jwtSecret, signOptions);
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(' ')[1]; // Bearer XXXXXX
    const decode = jwt.verify( token, jwtSecret );
    req.user = decode;
    // console.log(`req.user: `); console.log(req.user);
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
