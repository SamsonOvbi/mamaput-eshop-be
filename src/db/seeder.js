'use strict';

const express = require('express');
const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Load models
const ProductModel = require('./models/product.model');
const BookModel = require('./models/book.model');
const UserModel = require('./models/user.model');
const RoleModel = require('./models/role.model');
const CategoryModel = require('./models/category.model');


const dBaseSeed = express.Router();


// Faker generate 12 seed data for each table:;

dBaseSeed.get('/generate-seed-data', (req, res) => {
  const products = [];
  const books = [];
  const users = [];
  const roles = [];
  const categories = [];

  for (let i = 0; i < 12; i++) {
    const product = {
      name: faker.commerce.productName(),
      slug: faker.commerce.slugify(faker.commerce.productName()),
      image: faker.image.urlPicsumPhotos({ width: 240, height: 240 }),
      brand: faker.commerce.productName(),
      category: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 4, max: 150 }),
      countInStock: faker.number.int(),
      rating: faker.number.int({ min: 1, max: 5 })
    };
    products.push(product);

    const book = {
      isbn: faker.number.int({length: 13}),
      title: faker.commerce.productName(),
      subtitle: faker.commerce.productName(),
      slug: faker.commerce.productName(),
      author: faker.commerce.productName(),
      published: faker.commerce.productName(),
      publisher: faker.commerce.productName(),
      pages: faker.number.int({length: 13}),
      description: faker.commerce.productDescription(),
      website: faker.internet.website(),
    };
    books.push(book);

    const user = {
      name: faker.person.fullName(),
      phone: faker.phone.number(),
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
      user: faker.string.fromCharacters(['admin', 'user', 'guest'])
    };
    roles.push(role);

    const category = {
      name: faker.commerce.department()
    };
    categories.push(category);
  }

    res.json({ products, books, users, roles, categories });

});


// Insert seed data into JSON files:

dBaseSeed.get('/insert-json-data', (req, res) => {
  const { products, books, users, roles, categories } = req.body;

  fs.writeFile('DB/data/products.json', JSON.stringify(products), (err) => {
    if (err) throw err;
    console.log('Products data inserted into products.json');
  });


  fs.writeFile('DB/data/books.json', JSON.stringify(books), (err) => {
    if (err) throw err;
    console.log('Books data inserted into books.json');
  });

  fs.writeFile('DB/data/users.json', JSON.stringify(users), (err) => {
    if (err) throw err;
    console.log('Users data inserted into users.json');
  });


  fs.writeFile('DB/data/roles.json', JSON.stringify(roles), (err) => {
    if (err) throw err;
    console.log('Roles data inserted into roles.json');
  });

  fs.writeFile('DB/data/categories.json', JSON.stringify(categories), (err) => {
    if (err) throw err;
    console.log('Categories data inserted into categories.json');
  });

  res.send('data inserted into JSON files');
});

// Populate MySQL database with JSON data:

dBaseSeed.get('/populate-database', async (req, res) => {
  const productsData = require('./data/products.json');
  const booksData = require('./data/books.json');
  const usersData = require('./data/users.json');
  const rolesData = require('./data/roles.json');
  const categoriesData = require('./data/categories.json');

  try {
    await ProductModel.create(productsData);
    await BookModel.create(booksData);
    await UserModel.create(usersData);
    await RoleModel.create(rolesData);
    await CategoryModel.create(categoriesData);

    console.log('Data Imported...');
    res.send('Data Imported into DB...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/get-database', async (req, res) => {
  let productsData, usersData, booksData, categoriesData, rolesData ;

  try {
    productsData = await ProductModel.find();
    booksData = await BookModel.find();
    usersData = await UserModel.find();
    rolesData = await RoleModel.find();
    categoriesData = await CategoryModel.find();

    console.log('Data Imported...');
    res.json({ productsData, usersData, booksData, categoriesData, rolesData });
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/delete-collections', async (req, res) => {
  try {
    await BookModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();
    await RoleModel.deleteMany();
    await CategoryModel.deleteMany();

    console.log('Data Destroyed...');
    res.json('Data Destroyed...');
  } catch (err) {
    console.error(err);
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder endpoint'));

module.exports = dBaseSeed;
