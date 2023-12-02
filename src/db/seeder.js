'use strict';

const express = require('express');

// Load models
const BookModel = require('../models/book.model');
const OrderModel = require('../models/order.model');
const ProductModel = require('../models/product.model');
const RoleModel = require('../models/role.model');
const UserModel = require('../models/user.model');

const dBaseSeed = express.Router();

// Populate MySQL database with JSON data:
// dBaseSeed.post('/populate-database', async (req, res) => {
dBaseSeed.get('/populate-database', async (req, res) => {
  // const booksData = require('./data/books.json');
  // const fakerStoreData = require('./data/faker-store.json');
  // const productsData = require('./data/products.json');
  // const rolesData = require('./data/roles.json');
  const usersData = require('./data/user.data.js');

  try {
    // await BookModel.create(booksData);
    // await CategoryModel.create(categoriesData);
    // await ProductModel.create(fakerStoreData);
    // await ProductModel.create(productsData);
    // await RoleModel.create(productsData);
    await UserModel.create(usersData);

    // const results = { booksData, fakerStoreData, productsData, rolesData, usersData };
    const results = { usersData, };
    console.log(results.usersData);
    res.send('Data Imported into db...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/read-database', async (req, res) => {
  let booksData, categoriesData, ordersData, fakerStoreData, productsData, rolesData, usersData;

  try {
    booksData = await BookModel.find();
    ordersData = await OrderModel.find();
    fakerStoreData = await ProductModel.find();
    productsData = await ProductModel.find();
    rolesData = await RoleModel.find();
    usersData = await UserModel.find();

    const results = { booksData, categoriesData, ordersData, fakerStoreData, productsData, rolesData, usersData };
    console.log('Data read from database...', results.usersData);
    // console.log('Data read from database...' );
    res.json({ usersData });

  } catch (err) {
    console.error(err);
  }

});

// dBaseSeed.post('/delete-database', async (req, res) => {
dBaseSeed.get('/delete-database', async (req, res) => {
  try {
    // await BookModel.deleteMany();
    // await CategoryModel.deleteMany();
    // await OrderModel.deleteMany();
    // await ProductModel.deleteMany();
    // await ProductModel.deleteMany();
    // await RoleModel.deleteMany();
    await UserModel.deleteMany();

    console.log('Data Destroyed...');
    res.json('Data Destroyed...');
  } catch (err) {
    console.error(err);
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder endpoint'));

module.exports = dBaseSeed;
