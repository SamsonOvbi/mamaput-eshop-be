'use strict';

const express = require('express');
const { faker } = require('@faker-js/faker'); const fs = require('fs');
// const mongoose = require('mongoose');

// Load models
const ArticleModel = require('./models/article.model');
const CategoryModel = require('./models/category.model');
const ProductModel = require('./models/product.model');
const RoleModel = require('./models/role.model');
const UserModel = require('./models/user.model');

const dBaseSeed = express.Router();


// Faker generate 12 seed data for each table:;

dBaseSeed.get('/generate-seed-data', (req, res) => {

  const articles = [];
  const categories = [];
  const products = [];
  const users = [];
  const roles = [];

  for (let i = 0; i < 12; i++) {
    2
    const product = {
      name: faker.commerce.productName(),
      categoryID: faker.number.int({ min: 1, max: 12 }),
      imageUrl: faker.image.urlPicsumPhotos({ width: 240, height: 240 }),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 4, max: 150 }),
      status: faker.string.fromCharacters(['available', 'out of stock'])
    };
    products.push(product);

    const titleKey = faker.commerce.productName();
    const article = {
      title: titleKey,
      key: faker.helpers.slugify(titleKey),
      content: faker.commerce.productDescription(),
      description: faker.commerce.productDescription(),
      date: faker.date.recent({ days: 10 }),
      imageUrl: faker.image.urlPicsumPhotos({ width: 240, height: 240 }),
    };
    articles.push(article);
1
    const user = {
      name: faker.person.fullName(),
      phone: faker.string.numeric({ length: 11, allowLeadingZeros: true }),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 7 }),
      status: faker.string.fromCharacters(['true', 'false']),
      role: faker.string.fromCharacters(['admin', 'user'])
    };
    users.push(user);

    const role = {
      title: faker.commerce.productName(),
      text: faker.commerce.productDescription(),
      rating: faker.number.int({ min: 1, max: 5 }),
      bootcamp: faker.commerce.productDescription(),
      user: faker.string.fromCharacters(['admin', 'user'])
    };
    roles.push(role);

    const category = {
      name: faker.commerce.productAdjective()
    };
    categories.push(category);
  }

  res.json({ products, articles, users, roles, categories });

});


// Insert seed data into JSON files:

dBaseSeed.get('/insert-json-data', (req, res) => {
  // const { products, articles, users, roles, categories } = req.body;
  const { articles } = req.body;

  fs.writeFile('db/data/articles.json', JSON.stringify(articles), (err) => {
    if (err) throw err;
    console.log('Articles data inserted into articles.json');
  });

  // fs.writeFile('db/data/categories.json', JSON.stringify(categories), (err) => {
  //   if (err) throw err;
  //   console.log('Categories data inserted into categories.json');
  // });

  // fs.writeFile('db/data/products.json', JSON.stringify(products), (err) => {
  //   if (err) throw err;
  //   console.log('Products data inserted into products.json');
  // });

  // fs.writeFile('db/data/roles.json', JSON.stringify(roles), (err) => {
  //   if (err) throw err;
  //   console.log('Roles data inserted into roles.json');
  // });

  // fs.writeFile('db/data/users.json', JSON.stringify(users), (err) => {
  //   if (err) throw err;
  //   console.log('Users data inserted into users.json');
  // });

  res.send('data inserted into JSON files');
});

// Populate MySQL database with JSON data:

dBaseSeed.get('/populate-database', async (req, res) => {

  const articlesData = require('./data/articles.json');
  const categoriesData = require('./data/categories.json');
  const productsData = require('./data/products.json');
  const rolesData = require('./data/roles.json');
  const usersData = require('./data/users.json');

  try {
    await ArticleModel.create(articlesData);
    await CategoryModel.create(categoriesData);
    await RoleModel.create(rolesData);
    await ProductModel.create(productsData);
    await UserModel.create(usersData);

    console.log('Data Imported into db...');
    res.send('Data Imported into db...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/read-database', async (req, res) => {
  let productsData, usersData, articlesData, categoriesData, rolesData;

  try {
    articlesData = await ArticleModel.find();
    categoriesData = await CategoryModel.find();
    productsData = await ProductModel.find();
    rolesData = await RoleModel.find();
    usersData = await UserModel.find();

    console.log('Data read from db...');
    res.json({ productsData, usersData, articlesData, categoriesData, rolesData });
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/delete-collections', async (req, res) => {
  try {
    await ArticleModel.deleteMany();
    await CategoryModel.deleteMany();
    await ProductModel.deleteMany();
    await RoleModel.deleteMany();
    await UserModel.deleteMany();

    console.log('Data Destroyed...');
    res.json('Data Destroyed...');
  } catch (err) {
    console.error(err);
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder api endpoint'));

module.exports = dBaseSeed;
