'use_strict'

const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const dotenv =  require('dotenv');

dotenv.config();
// const ProductModel = require('../db/models/product.model');

const paypalRoute = express.Router();

paypalRoute.get('/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

paypalRoute.get('/', expressAsyncHandler(async (req, res) => {
  res.send({message: 'Welcome to paypal gateway'});
})
);

module.exports = paypalRoute;
