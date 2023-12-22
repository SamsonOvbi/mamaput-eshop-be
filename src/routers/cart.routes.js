const express = require('express')
const cartRoute = express.Router()
const cartContr = require('../controller/cart.controller')
const { isAuth, isAdmin } = require('../services/auth')

cartRoute.get('/', isAuth, cartContr.getAllCarts);
cartRoute.get('/user', isAuth, cartContr.getUserCart);
cartRoute.get('/test', cartContr.test);
cartRoute.post('/', isAuth, cartContr.createCart);

cartRoute.put('/user', isAuth, cartContr.editCart);
cartRoute.patch('/:id', isAuth, cartContr.editCart);
cartRoute.delete('/user/:userid', isAuth, cartContr.deleteCart);

module.exports = cartRoute
