'use strict';

const express = require('express');
const { faker } = require('@faker-js/faker');
const fs = require('fs');

// Load models
const BookModel = require('./models/book.model');
const CategoryModel = require('./models/category.model');
const OrderModel = require('./models/order.model');
const ProductModel = require('./models/product.model');
const RoleModel = require('./models/role.model');
const UserModel = require('./models/user.model');

const dBaseSeed = express.Router();

// Faker generate 12 seed data for each table:;

dBaseSeed.get('/generate-seed-data', (req, res) => {
  const books = [];
  const categories = [];
  const products = [];
  const roles = [];
  const users = [];

  for (let i = 0; i < 12; i++) {
    const bookName = faker.commerce.productName();
    const book = {
      isbn: faker.number.int({ length: 13 }),
      title: bookName,
      slug: faker.helpers.slugify(bookName.toLocaleLowerCase()),
      category: faker.commerce.department(),
      image: faker.image.urlPicsumPhotos({ width: 240, height: 240 }),
      subtitle: faker.commerce.productName(),
      author: faker.person.fullName(),
      published: faker.date.past({ years: 2 }),
      publisher: faker.commerce.department(),
      pages: faker.number.int({ min: 40, max: 127 }),
      description: faker.commerce.productDescription(),
      website: faker.internet.url(),
    };
    books.push(book);

    const category = {
      name: faker.commerce.department()
    };
    categories.push(category);

    const prodName = faker.commerce.productName();

    const product = {
      name: prodName,
      slug: faker.helpers.slugify(prodName.toLowerCase()),
      category: faker.commerce.department(),
      image: faker.image.urlPicsumPhotos({ width: 240, height: 240 }),
      description: faker.commerce.productDescription(),
      brand: faker.commerce.productName(),
      price: faker.commerce.price({ min: 4, max: 150 }),
      countInStock: faker.number.int({ min: 10, max: 57 }),
      rating: faker.number.float({ min: 2, max: 5, precision: 0.1 })
    };
    products.push(product);

    const role = {
      title: faker.commerce.productName(),
      text: faker.commerce.productDescription(),
      rating: faker.number.int({ min: 1, max: 5 }),
      bootcamp: faker.commerce.productDescription(),
      user: faker.string.fromCharacters(['admin', 'user', 'guest'])
    };
    roles.push(role);

    const fName = faker.person.firstName();
    const lName = faker.person.lastName();
    const user = {
      name: faker.person.fullName({ firstName: fName, lastName: lName }),
      phone: faker.number.int({ length: 11, min: 70200000000, max: 92000000000 }),
      email: faker.internet.email({ firstName: fName.toLowerCase(), lastName: lName.toLowerCase() }),
      password: faker.internet.password({ length: 7 }),
      status: faker.string.fromCharacters(['true', 'false']),
      role: faker.string.fromCharacters(['user', 'guest'])
    };
    users.push(user);

  }

  res.json({ books, categories, products, roles, users });

});


// Insert seed data into JSON files:

dBaseSeed.get('/insert-json-data', (req, res) => {
  // const { books, categories, orders, products, roles, users } = req.body;
  const { books, categories, products, roles, users } = req.body;

  fs.writeFile('src/db/data/books.json', JSON.stringify(books), (err) => {
    if (err) throw err;
    console.log('Books data inserted into books.json');
  });

  fs.writeFile('db/data/categories.json', JSON.stringify(categories), (err) => {
    if (err) throw err;
    console.log('Categories data inserted into categories.json');
  });

  fs.writeFile('src/db/data/products.json', JSON.stringify(products), (err) => {
    if (err) throw err;
    console.log('Products data inserted into products.json');
  });

  fs.writeFile('db/data/roles.json', JSON.stringify(roles), (err) => {
    if (err) throw err;
    console.log('Roles data inserted into roles.json');
  });

  fs.writeFile('src/db/data/users.json', JSON.stringify(users), (err) => {
    if (err) throw err;
    console.log('Users data inserted into users.json');
  });

  res.send('data inserted into JSON files');
});

// Populate MySQL database with JSON data:

dBaseSeed.get('/populate-database', async (req, res) => {
  const booksData = require('./data/books.json');
  const categoriesData = require('./data/categories.json');
  const productsData = require('./data/products.json');
  const rolesData = require('./data/roles.json');
  const usersData = require('./data/users.json');

  try {
    await BookModel.create(booksData);
    await CategoryModel.create(categoriesData);
    await ProductModel.create(productsData);
    await RoleModel.create(rolesData);
    await UserModel.create(usersData);

    console.log('Data Imported into db...');
    res.send('Data Imported into db...');
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/read-database', async (req, res) => {
  let booksData, categoriesData, ordersData, productsData, rolesData, usersData;

  try {
    booksData = await BookModel.find();
    // categoriesData = await CategoryModel.find();
    // ordersData = await OrderModel.find();
    // productsData = await ProductModel.find();
    // rolesData = await RoleModel.find();
    // usersData = await UserModel.find();

    console.log('Data read from database...', res.json({ booksData }));
    // res.json({ booksData, categoriesData, ordersData, productsData, rolesData, usersData });
    return ({ booksData, categoriesData, ordersData, productsData, rolesData, usersData });
  } catch (err) {
    console.error(err);
  }

});

dBaseSeed.get('/delete-collections', async (req, res) => {
  try {
    // await BookModel.deleteMany();
    // await CategoryModel.deleteMany();
    await OrderModel.deleteMany();
    // await ProductModel.deleteMany();
    // await RoleModel.deleteMany();
    // await UserModel.deleteMany();

    console.log('Data Destroyed...');
    res.json('Data Destroyed...');
  } catch (err) {
    console.error(err);
  }
});

dBaseSeed.get('/', (req, res) => res.send('Welcome to seeder endpoint'));

module.exports = dBaseSeed;
