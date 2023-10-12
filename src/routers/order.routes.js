"use strict";

const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../db/models/user.model');
const { isAdmin, isAuth } = require('../utils');
const OrderModel = require('../db/models/order.model');
const ProductModel = require('../db/models/product.model');

const orderRouter = express.Router();

orderRouter.get( '/', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const orders = await OrderModel.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.get( '/summary', isAuth, isAdmin, asyncHandler(async (req, res) => {
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
  })
);

orderRouter.get( '/history', isAuth, asyncHandler(async (req, res) => {
    const orders = await OrderModel.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.post( '/', isAuth, asyncHandler(async (req, res) => {
  console.log('req.body.items.length: ' + req.body.items.length);
    if (req.body.items.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const createdOrder = await OrderModel.create({
        items: req.body.items.map((x) => ({ ...x, product: x._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      console.log('createdOrder: ' + createdOrder);
      res.status(201).send(createdOrder);
    }
  })
);

orderRouter.get( '/:id', isAuth, asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    console.log('req.params.id: ' + req.params.id);
    console.log('order: ' + order);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message_id: 'Order Not Found' });
    }
  })
);

orderRouter.put( '/:id/pay', isAuth, asyncHandler(async (req, res) => {
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
  })
);

orderRouter.delete( '/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put( '/:id/deliver', isAuth, isAdmin, asyncHandler(async (req, res) => {
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
  })
);

module.exports = orderRouter;
