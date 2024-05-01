"use strict";

// const express = require('express');
const asyncHandler = require('express-async-handler');
const OrderModel = require('../models/order.model');
const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');
// const { loggerService } = require('../services/logger.service');

const orderContr = {};

orderContr.getOrders = asyncHandler(async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 0;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const orders = await OrderModel.find().limit(limit).sort({ id: sort });
    if (orders) {
      res.send(orders);
    } else {
      console.error({ message: 'No orders found' });
      res.status(404).send({ message: 'No orders found' });
    }
  } catch (error) {
    console.error('Error occurred during database operation: ', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

orderContr.getSummary = asyncHandler(async (req, res) => {
  const orders = await OrderModel.aggregate([{
    $group: {
      _id: null, numOrders: { $sum: 1 }, totalSales: { $sum: '$totalPrice' },
    },
  },
  ]);
  const users = await UserModel.aggregate([{
    $group: {
      _id: null, numUsers: { $sum: 1 },
    },
  },
  ]);
  const dailyOrders = await OrderModel.aggregate([{
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
      orders: { $sum: 1 }, sales: { $sum: '$totalPrice' },
    },
  },
  { $sort: { _id: 1 } },
  ]);
  const productCategories = await ProductModel.aggregate([{
    $group: {
      _id: '$category', count: { $sum: 1 },
    },
  },
  ]);
  res.send({ users, orders, dailyOrders, productCategories });
});

orderContr.getAddress = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });
  // res.send(orders);
  const result = orders[orders.length - 1];
  console.log("result.shippingAddress: "); console.log(result.shippingAddress)
  res.send(orders[orders.length - 1]);
});

orderContr.getHistory = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({ user: req.user._id });
  res.send(orders);
});

orderContr.addOrder = asyncHandler(async ({ body, user }, res) => {
  try {
    if (!body.items.length) {
      console.log('Attempt to add order with empty cart');
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      // console.log(`body.items.length: ${body.items.length}`);
      const createdOrder = await OrderModel.create({
        items: body.items.map((x) => ({ ...x, product: x._id })),
        shippingAddress: body.shippingAddress,
        paymentMethod: body.paymentMethod,
        itemsPrice: body.itemsPrice,
        shippingPrice: body.shippingPrice,
        taxPrice: body.taxPrice,
        totalPrice: body.totalPrice,
        user: user._id,
      });
      console.log(`Order created successfully: ${createdOrder._id}`);
      res.status(201).send(createdOrder);
    }
  } catch (error) {
    console.error('Error occurred while adding order: ', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

orderContr.getOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  // console.log('req.params.id: ' + req.params.id);
  // console.log('order: ' + order);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message_id: 'Order Not Found' });
  }
});

orderContr.payOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate('user');

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date(Date.now());
    order.paymentResult = {
      paymentId: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();

    res.send(updatedOrder);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

orderContr.deleteOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    const deleteOrder = await order.remove();
    res.send({ message: 'Order Deleted', order: deleteOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

orderContr.deliverOrder = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date(Date.now());
    // order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
});

orderContr.test = asyncHandler(async (req, res) => {
  res.send({ message: 'Welcome to order api endpoint' });
});

module.exports = orderContr;
