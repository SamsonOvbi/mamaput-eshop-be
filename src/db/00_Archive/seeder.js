'use strict';

const express = require('express');
const { faker } = require('@faker-js/faker'); const fs = require('fs');
// const mongoose = require('mongoose');

// Load models
const ProductModel = require('./models/product.model');
const ArticleModel = require('./models/article.model');
const UserModel = require('./models/user.model');
const RoleModel = require('./models/role.model');
const CategoryModel = require('./models/category.model');


const dBaseSeed = express.Router();


// Faker generate 12 seed data for each table:;

dBaseSeed.get('/generate-seed-data', (req, res) => {

  const products = [];
  const articles = [];
  const users = [];
  const roles = [];
  const categories = [];


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

  // fs.writeFile('DB/data/products.json', JSON.stringify(products), (err) => {
  //   if (err) throw err;
  //   console.log('Products data inserted into products.json');
  // });


  fs.writeFile('DB/data/articles.json', JSON.stringify(articles), (err) => {
    if (err) throw err;
    console.log('Articles data inserted into articles.json');
  });

  // fs.writeFile('DB/data/users.json', JSON.stringify(users), (err) => {
  //   if (err) throw err;
  //   console.log('Users data inserted into users.json');
  // });


  // fs.writeFile('DB/data/roles.json', JSON.stringify(roles), (err) => {
  //   if (err) throw err;
  //   console.log('Roles data inserted into roles.json');
  // });

  // fs.writeFile('DB/data/categories.json', JSON.stringify(categories), (err) => {
  //   if (err) throw err;
  //   console.log('Categories data inserted into categories.json');
  // });

  res.send('data inserted into JSON files');
});

// Populate MySQL database with JSON data:

dBaseSeed.get('/populate-database', async (req, res) => {
  const productsData = require('./data/products.json');
  const articlesData = require('./data/articles.json');
  const usersData = require('./data/users.json');
  const rolesData = require('./data/roles.json');
  const categoriesData = require('./data/categories.json');

  try {
    await ProductModel.create(productsData);
    await ArticleModel.create(articlesData);
    await UserModel.create(usersData);
    await RoleModel.create(rolesData);
    await CategoryModel.create(categoriesData);

    console.log('Data Imported into DB...');
    res.send('Data Imported into DB...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/read-database', async (req, res) => {
  let productsData, usersData, articlesData, categoriesData, rolesData;

  try {
    productsData = await ProductModel.find();
    articlesData = await ArticleModel.find();
    usersData = await UserModel.find();
    rolesData = await RoleModel.find();
    categoriesData = await CategoryModel.find();

    console.log('Data read from DB...');
    res.json({ productsData, usersData, articlesData, categoriesData, rolesData });
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/delete-collections', async (req, res) => {
  try {
    await ProductModel.deleteMany();
    await ArticleModel.deleteMany();
    await UserModel.deleteMany();
    await RoleModel.deleteMany();
    await CategoryModel.deleteMany();

    console.log('Data Destroyed...');
    res.json('Data Destroyed...');
  } catch (err) {
    console.error(err);
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder api endpoint'));

module.exports = dBaseSeed;
