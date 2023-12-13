// const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const UserModel = require('../src/db/models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../src/services/auth');

const authContr = {};
// authContr.login = (req, res) => {
// 	const username = req.body.username;
// 	const password = req.body.password;
// 	if (username && password) {
// 		UserModel.findOne({username: username, password: password,})
// 			.then((user) => {
// 				if (user) {
// 					res.json({
// 						token: jwt.sign({ user: username }, 'secret_key'),
// 					});
// 				} else {
// 					res.status(401);
// 					res.send('username or password is incorrect');
// 				}
// 			})
// 			.catch((err) => {
// 				console.error(err);
// 			});
// 	}
// };

// authContr.post( '/login', expressAsyncHandler(async (req, res) => {
  authContr.login = expressAsyncHandler(async (req, res) => {
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
});

module.exports = authContr;
