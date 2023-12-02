'use_strict'

const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const dotenv =  require('dotenv');
const paypalContr = require('../controller/paypal.controller');
const stripeContr = require('../controller/stripe.controller');

dotenv.config();
// const ProductModel = require('../db/models/product.model');

const paymentRoute = express.Router();

paymentRoute.get('/paypal/checkout', paypalContr.checkout);
paymentRoute.get('/paypal', paypalContr.get);
paymentRoute.get('/stripe/checkout', stripeContr);
paymentRoute.get('/stripe', stripeContr);

paymentRoute.get('/', expressAsyncHandler(async (req, res) => {
  res.send({message: 'Welcome to payment gateway'});
})
);

module.exports = paymentRoute;
