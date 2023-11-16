"use strict";

const dotenv =  require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');
// const User = require('./db/models/user.model');

const generateToken = (user) => {
  return jwt.sign({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || 'somethingsecret', {
      expiresIn: '30d',
    }
  );
};

const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    // const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    const token = authorization.split(' ')[1]; // Bearer XXXXXX
    const decode = jwt.verify( token, process.env.JWT_SECRET || 'somethingsecret' );
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
