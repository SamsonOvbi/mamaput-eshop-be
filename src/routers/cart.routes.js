const express = require('express')
const cartRoute = express.Router()
const cartContr = require('../controller/cart.controller')
const { isAuth, isAdmin } = require('../services/auth')

cartRoute.get('/', isAuth, cartContr.getAllCarts);
cartRoute.get('/user/:userid', isAuth, cartContr.getCartsByUserid);
cartRoute.get('/test', cartContr.test);
cartRoute.post('/', isAuth, cartContr.createCart);

// cartRoute.put('/:id', isAuth, cartContr.editCart);
cartRoute.put('/user/:userid', isAuth, cartContr.editCart);
cartRoute.patch('/:id', isAuth, cartContr.editCart);
cartRoute.delete('/:id', isAuth, cartContr.deleteCart);

module.exports = cartRoute
