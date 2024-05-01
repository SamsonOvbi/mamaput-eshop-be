"use strict";

const express = require('express');
const { isAdmin, isAuth } = require('../services/auth.service');
const orderContr = require('../controller/order.controller');

const orderRoute = express.Router();

orderRoute.get('/', isAuth, isAdmin, orderContr.getOrders);
orderRoute.get('/summary', isAuth, orderContr.getSummary);
orderRoute.get('/address', isAuth, orderContr.getAddress);
orderRoute.get('/history', isAuth, orderContr.getHistory);
orderRoute.get('/test', orderContr.test);

orderRoute.post('/create', isAuth, orderContr.addOrder);
orderRoute.get('/:id', isAuth, orderContr.getOrder);

orderRoute.put('/:id/pay', isAuth, orderContr.payOrder);
orderRoute.delete('/:id', isAuth, isAdmin, orderContr.deleteOrder);
orderRoute.put('/:id/deliver', isAuth, isAdmin, orderContr.deliverOrder);

module.exports = orderRoute;