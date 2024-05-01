'use strict';

const express = require('express');

// Load models
const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
// const RoleModel = require('../models/role.model');
const UserModel = require('../models/user.model');
const CartModel = require('../models/cart.model.js');

const dBaseSeed = express.Router();

// Populate database with JSON data: 
dBaseSeed.post('/populate-database', async (req, res) => {
// dBaseSeed.get('/populate-database', async (req, res) => {

  // const bookData = require('./data/books.json');
  const productData = require('./data/products.json');
  // const roleData = require('./data/roles.json');
  const userData = require('./data/user.data.js');
  // const fakerStoreData = require('./data/faker-store.json');
  // const orderData = require('./data/orders.json');
  // const cartData = require('./data/carts.json');

  try {
    // await ProductModel.create(bookData);
    await ProductModel.create(productData);
    // await RoleModel.create(rollData);
    await UserModel.create(userData);
    // await OrderModel.create(orderData);
    // await CartModel.create(cartData);

    res.send('Data Imported into db...');
  } catch (err) {
    console.error(err);
  }
  
});

dBaseSeed.get('/read-database', async (req, res) => {
  let cartData, orderData, productData, roleData, userData;

  try {
    orderData = await OrderModel.find();
    cartData = await CartModel.find();
    productData = await ProductModel.find();
    // roleData = await RoleModel.find();
    userData = await UserModel.find();

    const readings = { orderData, cartData, productData, roleData, userData }
    console.log('Data read from database...', readings.productData);
    // res.json({ productData  });
    res.json(readings.orderData, readings.productData, readings.userData, readings.cartData);

  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.post('/delete-database', async (req, res) => {
// dBaseSeed.get('/delete-database', async (req, res) => {
  try {
    // await CartModel.deleteMany();
    // await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    // await RoleModel.deleteMany();
    await UserModel.deleteMany();
    const message = `OrderModel Data Destroyed...`
    console.log(message);
    res.json(message);
  } catch (err) {
    console.error(err);
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder endpoint'));

module.exports = dBaseSeed;
