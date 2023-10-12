"use strict";

const dotenv = require('dotenv');
const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../db/models/user.model');
const { isAdmin, isAuth } = require('../utils');
const OrderModel = require('../db/models/order.model');
const ProductModel = require('../db/models/product.model');

dotenv.config();
const payRouter = express.Router();

payRouter.get( '/', asyncHandler(async (req, res) => {
  const name = (req.query.name || '');
  const category = (req.query.category || '');
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0
      ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder = order === 'lowest'? { price: 1 }: order === 'highest'
        ? { price: -1 }: order === 'toprated'? { rating: -1 }: { _id: -1 };
  const products = await ProductModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
  .sort(sortOrder);
  res.send(products);
}));

// payRouter.get('/', (req, res) => {
//   res.send({Message: 'Welcome to checkout page'})
//   // res.send({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
// });

payRouter.get( '/paypal', isAuth, asyncHandler(async (req, res) => {
  const orders = await OrderModel.aggregate([{
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await UserModel.aggregate([{
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await OrderModel.aggregate([{
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const productCategories = await ProductModel.aggregate([{
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });
}));

payRouter.get( '/stripe', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const orders = await OrderModel.aggregate([{
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);
  const users = await UserModel.aggregate([{
      $group: {
        _id: null,
        numUsers: { $sum: 1 },
      },
    },
  ]);
  const dailyOrders = await OrderModel.aggregate([{
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const productCategories = await ProductModel.aggregate([{
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });
}));

module.exports = payRouter;
