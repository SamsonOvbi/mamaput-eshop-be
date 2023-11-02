'use_strict'

const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const dotenv =  require('dotenv');

dotenv.config();
// const ProductModel = require('../db/models/product.model');

const paymentRouter = express.Router();

paymentRouter.get('/', expressAsyncHandler(async (req, res) => {
  res.send({message: 'Welcome to payment gateway'});
})
);

paymentRouter.get('/stripe', expressAsyncHandler(async (req, res) => {
  res.send({ clientId: process.env.STRIPE_CLIENT_ID || 'sb' });
})
);

paymentRouter.get('/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

module.exports = paymentRouter;
