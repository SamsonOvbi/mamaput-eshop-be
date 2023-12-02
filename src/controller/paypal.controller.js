'use_strict'

// const express = require('express');
const asyncHandler = require('express-async-handler');
const dotenv =  require('dotenv');

dotenv.config();
// const ProductModel = require('../db/models/product.model');

const paypalContr = {};

paypalContr.checkout = asyncHandler(async (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

paypalContr.get = asyncHandler(async (req, res) => {
  res.send({message: 'Welcome to paypal gateway'});
});

module.exports = paypalContr;
