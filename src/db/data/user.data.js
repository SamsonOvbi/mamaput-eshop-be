"use strict";

const bcrypt = require('bcryptjs');

const userData = [
  {
    name: 'Joe Admin',
    email: 'joe.admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'John',
    email: 'user@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
  {
    name: 'Janet Zeta Jones',
    email: 'janet.z.jones@gmail.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'Samson Rerri',
    email: 'samson.rerri@gmail.com',
    password: bcrypt.hashSync('246824'),
    isAdmin: false,
  },
  {
      name: "Elise Nyota",
      email: "elise.nyota@example.com",
      password: bcrypt.hashSync('246824'),
      isAdmin: false
  },
  {
      name: "Parcey Ogaga",
      email: "parcey.ogaga@example.com",
      password: bcrypt.hashSync('246824'),
      isAdmin: false
  }
];

module.exports = userData;
