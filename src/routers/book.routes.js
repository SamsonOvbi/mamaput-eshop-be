"use strict";

const express = require('express');
const { isAdmin, isAuth } = require('../services/auth');
const bookContr = require('../controller/book.controller');

const bookRoute = express.Router();

bookRoute.get('/', bookContr.getAllBooks);

bookRoute.get('/paged', bookContr.getPagedBooks);

bookRoute.get('/categories', bookContr.getBookCategories);
bookRoute.get('/:id', bookContr.getBook);
bookRoute.get('/slug/:slug', bookContr.getBookBySlug);
bookRoute.get('/category/:category', bookContr.getBooksInCategory);

bookRoute.post('/', isAuth, isAdmin, bookContr.addBook);

bookRoute.put('/:id', isAuth, isAdmin, bookContr.editBook);

bookRoute.delete('/:id', isAuth, isAdmin, bookContr.deleteBook);

bookRoute.post('/:id/reviews', isAuth, bookContr.writeReview);

module.exports = bookRoute
