// const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/auth.service');
const nodemailer = require("nodemailer");

const authContr = {}

authContr.registerUser = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body) {
    res.status(401).send({ status: 'error', message: 'data is undefined', });
  } else {
    let userCount = 0;
    // UserModel.find().countDocuments((err, count) => { userCount = count; })
    userCount = await UserModel.find().countDocuments();
    const tmpName = body.username.split(' ');
    const reqBody = {
      id: userCount + 1,
      email: body.email,
      username: body.username,
      password: bcrypt.hashSync(req.body.password),
      names: { firstname: tmpName[0], lastname: tmpName[tmpName.length - 1], },
      address: {},
      phone: body.phone,
    };
    const newUser = (await UserModel.create(reqBody))
    const { password, ...rest } = newUser._doc;
    console.log('registerUser password: '); console.log(password.split('0')[0]);
    res.send({ message: 'User registered', ...rest, token: generateToken(newUser), });
    // res.send({ message: 'User registered', newUser, token: generateToken(newUser), });

    //res.json({id:UserModel.find().count()+1,...req.body})
  }
});

authContr.login = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    console.log('authContr.login - user: '); console.log(user);
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const { password, ...rest } = user._doc;
      console.log('login password, Username: '); console.log(password.split('0')[0], rest.username);
      res.send({ message: 'User logged in', ...rest, token: generateToken(user), });
    }
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

authContr.updateProfile = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body) {
    res.send({ status: 'error', message: 'something went wrong! check your sent data', });
  } else {
    let tmpName = body.username || user.username;
    tmpName = tmpName.split(' ');
    // res.json({
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.username = body.username || user.username;
      user.email = body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password);
      }
      user.names = { firstname: tmpName[0], lastname: tmpName[tmpName.length - 1], };
      const updatedUser = await user.save();
      const { password, ...rest } = updatedUser._doc;
      console.log('updated profile password: '); console.log(password.split('0')[0]);
      res.send({ ...rest, token: generateToken(updatedUser), });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

authContr.forgotPassword = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    let mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: user.email,
      subject: "Password retrieval request",
      html:
        "<p>Your login details shown below <br> Email: " +
        user.email +
        "<br> Password: " + user.password +
        // "<br> <a href='http://localhost:8088'>Click Here to Login</a>" +
        "<br> <a href='http://localhost:4204'>Click Here to Login</a>" +
        "</p>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.log({ message: 'Check your internet connection', error });
        return res.status(500).json({ message: 'Check your internet connection', error });
      } else {
        console.log('info.response'); console.log(info.response);
        console.log(" \n Email sent");
        return res.status(200).json({ message: "Password sent to your email", });
      }
    });
  } else {
    res.status(404).json({ message: "Check your email and send again", });
  }

});

authContr.test = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "auth.controller API endpoint", });
})

module.exports = authContr;
