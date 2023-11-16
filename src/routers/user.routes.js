"use strict";

const dotenv =  require('dotenv');
dotenv.config();
const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../db/models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken, isAdmin, isAuth } = require('../services/auth');

const userRoute = express.Router();

userRoute.post( '/login', asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // return res.send({
        const resBody = {
          _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user),
        };
        res.send(resBody);
      }
    } else {
      res.status(401).send({ message: 'Invalid email or password' });
    }
  })
);

userRoute.post( '/register', asyncHandler(async (req, res) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });

    // res.send({_id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user), });
    const resBody = {
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token: generateToken(user),
    };
    res.send(resBody);

  })
);

userRoute.get( '/:id', asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRoute.put( '/update-profile', isAuth, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      const resBody = {
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      };
      res.send(resBody);
    }
  })
);

userRoute.get( '/', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const users = await UserModel.find({});
    res.send(users);
  })
);

userRoute.delete( '/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRoute.put( '/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

module.exports = userRoute;
