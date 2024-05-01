'use_strict'

const express = require('express');
// const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const paypalContr = require('../controller/paypal.controller');
const stripeContr = require('../controller/stripe.controller');
const { isAuth } = require('../services/auth.service');

dotenv.config();
// const ProductModel = require('../db/models/product.model');

const paymentRoute = express.Router();

paymentRoute.get('/paypal/checkout', isAuth, paypalContr.checkout);
paymentRoute.get('/paypal/test', paypalContr.test);

paymentRoute.get('/stripe/checkout', isAuth, stripeContr.checkout);
paymentRoute.get('/stripe/test', paypalContr.test);

paymentRoute.get('/test', (req, res) => {
  res.send({ message: 'Welcome to payment api endpoint' });
});

module.exports = paymentRoute;
