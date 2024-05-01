const asyncHandler = require("express-async-handler");
// const bcrypt = require('bcryptjs');
const { generateToken, } = require('../services/auth.service');
const UserModel = require("../models/user.model");

const userContr = {}

userContr.getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  // console.log('editUser users: '); console.log(users);
  res.send(users);
});

userContr.getUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    const { password, ...rest } = user._doc;
    console.log('getUser password: '); console.log(password);
    res.send(rest);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

userContr.editUser = asyncHandler(async (req, res) => {
  // if (typeof req.body == undefined || req.params.id == null) {
  const body = req.body;
  // console.log('editUser req.params.id: '); console.log(req.params.id);
  if (!body || req.params.id == null) {
    res.send({
      status: 'error',
      message: 'something went wrong! check your sent data',
    });
  } else {
    const tmpName = body.username.split(' ');
    // res.json({
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.email = body.email || user.email;
      user.username = body.username || user.username;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.names = {
        firstname: tmpName[0], // firstname: body.firstname,
        lastname: tmpName[tmpName.length - 1],// lastname: b
      };
      const updatedUser = await user.save();
      const { password, ...rest } = updatedUser._doc;
      console.log('editUser password: '); console.log(password);
      res.send({ message: 'User Updated', rest, token: generateToken(user), });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }
});

userContr.deleteUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (user) {
    if (user.email === 'admin@example.com') {
      res.status(400).send({ message: 'Can Not Delete Admin User' });
      return;
    }
    const deletedUser = await user.remove();
    res.send({ message: 'User Deleted', user: deletedUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

userContr.testApi = asyncHandler(async (req, res) => {
  res.send({ message: 'Welcome to user api endpoint' });
});

module.exports = userContr;
