const express = require('express')
const cartRoute = express.Router()
const cartContr = require('../controller/cart.controller')

cartRoute.get('/', cartContr.getAllCarts)
cartRoute.get('/:id', cartContr.getSingleCart)
cartRoute.get('/user/:userid', cartContr.getCartsByUserid)

cartRoute.post('/', cartContr.addCart)
// cartRoute.post('/:id', cartContr.addToCart)

cartRoute.put('/:id', cartContr.editCart)
cartRoute.patch('/:id', cartContr.editCart)
cartRoute.delete('/:id', cartContr.deleteCart)

module.exports = cartRoute
