const asyncHandler = require("express-async-handler");
const UserModel = require("../src/db/models/user.model");
const bcrypt = require('bcryptjs');
const { generateToken, } = require('../services/auth');

const userContr = {}

userContr.getAllUsers = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const sort = req.query.sort == 'desc' ? -1 : 1;

  const users = await UserModel.find().select(['-_id']).limit(limit).sort({ id: sort, })
  // const users = await UserModel.find({});
  res.send(users);
});

userContr.getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await UserModel.findOne({ id, }).select(['-_id'])
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

userContr.addUser = asyncHandler(async (req, res) => {
  const body = req.body;
  if (!body) {
    res.status(401).send({ status: 'error', message: 'data is undefined', });
  } else {
    let userCount = 0;
    UserModel.find().countDocuments((err, count) => { userCount = count; })
    const reqBody = {
      id: userCount + 1, email: body.email, username: body.username,
      password: bcrypt.hashSync(req.body.password),
      name: {
        firstname: body.firstname,
        lastname: body.lastname,
      },
      address: {
        city: body.address.city,
        street: body.address.street,
        number: body.number,
        zipcode: body.zipcode,
        geolocation: {
          lat: body.address.geolocation.lat,
          long: body.address.geolocation.long,
        },
      },
      phone: body.phone,
    };
    const user = await UserModel.create({ reqBody });
    const { password, ...rest } = user;
    let pass = pass || password;
    const resBody = {
      rest, isAdmin: user.isAdmin, token: generateToken(user),
    };
    res.send(resBody);

    //res.json({id:UserModel.find().count()+1,...req.body})
  }
});
userContr.login = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      // return res.send({
      const resBody = {
        _id: user._id, name: user.name, email: user.email,
        isAdmin: user.isAdmin, token: generateToken(user),
      };
      res.send(resBody);
    }
  } else {
    res.status(401).send({ message: 'Invalid email or password' });
  }
});

userContr.updateProfile = asyncHandler(async (req, res) => {
  // if (typeof req.body == undefined || req.params.id == null) {
  const body = req.body;
  if (!body || req.params.id == null) {
    res.send({
      status: 'error',
      message: 'something went wrong! check your sent data',
    });
  } else {
    // res.json({
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.email = body.email;
      user.username = body.username;
      user.name = {
        firstname: body.firstname,
        lastname: body.lastname,
      };
      user.address = {
        city: body.address.city,
        street: body.address.street,
        number: body.number,
        zipcode: body.zipcode,
        geolocation: {
          lat: body.address.geolocation.lat,
          long: body.address.geolocation.long,
        },
      };
      user.phone = body.phone;
      const updatedUser = await user.save();
      const { password, ...rest } = updatedUser;
      let pass = pass || password;
      const resBody = {
        rest, isAdmin: user.isAdmin, token: generateToken(user),
      };
      res.send({ message: 'User Updated', user: resBody });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  }
});

userContr.editUser = asyncHandler(async (req, res) => {
  // if (typeof req.body == undefined || req.params.id == null) {
  const body = req.body;
  if (!body || req.params.id == null) {
    res.send({
      status: 'error',
      message: 'something went wrong! check your sent data',
    });
  } else {
    // res.json({
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.email = body.email;
      user.username = body.username;
      user.name = {
        firstname: body.firstname,
        lastname: body.lastname,
      };
      const updatedUser = await user.save();
      const { password, ...rest } = updatedUser;
      let pass = pass || password;
      const resBody = {
        rest, isAdmin: user.isAdmin, token: generateToken(user),
      };
      res.send({ message: 'User Updated', user: resBody });
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
    const deleteUser = await user.remove();
    res.send({ message: 'User Deleted', user: deleteUser });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

module.exports = userContr;
