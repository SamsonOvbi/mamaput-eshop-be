"use strict";

const bcrypt = require('bcryptjs');

const userData = [
  {
    id: 1,
    username: 'Joe Admin',
    email: 'joe.admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    id: 2,
    username: 'John A. Shobola',
    email: 'johnashobola@gmail.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
  {
    id: 3,
    username: 'Janet Zeta Jones',
    email: 'janet.z.jones@gmail.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    id: 4,
    username: 'Samson Rerri',
    email: 'samson.rerri@gmail.com',
    password: bcrypt.hashSync('246824'),
    isAdmin: false,
  },
  {
    id: 5,
    username: "Elise Nyota",
    email: "elise.nyota@example.com",
    password: bcrypt.hashSync('246824'),
    isAdmin: false
  },
  {
    id: 6,
    username: "Parcey Ogaga",
    email: "parcey.ogaga@example.com",
    password: bcrypt.hashSync('246824'),
    isAdmin: false
  }
];

module.exports = userData;
