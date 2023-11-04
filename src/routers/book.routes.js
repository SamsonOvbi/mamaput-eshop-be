"use strict";

const express = require('express');
const asyncHandler = require('express-async-handler');
const { isAdmin, isAuth } = require('../services/auth');
const BookModel = require('../db/models/book.model');
const bookData = require('../db/data/book.data');
const bookRouter = express.Router();

bookRouter.get('/', asyncHandler(async (req, res) => {
  const title = (req.query.title || '');
  const category = (req.query.category || '');
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0
    ? Number(req.query.rating) : 0;

  const titleFilter = title ? { title: { $regex: title, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const pageFilter = min && max ? { page: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder = order === 'lowest' ? { page: 1 } : order === 'highest' ? { page: -1 }
    : order === 'toprated' ? { rating: -1 } : { _id: -1 };
  const books = await BookModel.find({
    ...titleFilter, ...categoryFilter, ...pageFilter, ...ratingFilter,
  })
    .sort(sortOrder);
  res.send(books);
})
);

bookRouter.get('/paged', asyncHandler(async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;
  const title = (req.query.title || '');
  const category = (req.query.category || '');
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const titleFilter = title ? { title: { $regex: title, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const pageFilter = min && max ? { page: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder = order === 'lowest' ? { page: 1 } : order === 'highest'
    ? { page: -1 } : order === 'toprated' ? { rating: -1 } : { _id: -1 };
  const count = await BookModel.count({
    ...titleFilter, ...categoryFilter, ...pageFilter, ...ratingFilter,
  });
  const books = await BookModel.find({
    ...titleFilter, ...categoryFilter, ...pageFilter, ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ books, page, pages: Math.ceil(count / pageSize) });
})
);

bookRouter.get('/categories', asyncHandler(async (req, res) => {
  const categories = await BookModel.find().distinct('category');
  res.send(categories);
})
);

bookRouter.get('/seed', asyncHandler(async (req, res) => {
  await BookModel.remove();
  const createdBooks = await BookModel.insertMany(bookData);
  res.send({ createdBooks });
})
);

bookRouter.get('/slug/:slug', asyncHandler(async (req, res) => {
  const book = await BookModel.findOne({
    slug: req.params.slug,
  });
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
})
);

bookRouter.get('/:id', asyncHandler(async (req, res) => {
  const book = await BookModel.findOne(req.params.id);
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
})
);

bookRouter.post('/', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const book = await BookModel.create({
    title: 'sample title ' + Date.now(),
    image: '../assets/images/p1.jpg',
    page: 0,
    slug: 'sample-slug-' + Date.now(),
    category: 'sample category',
    brand: 'sample brand',
    rating: 0,
    numReviews: 0,
    description: 'sample description',
  });

  const createdBook = await book.save();
  res.send(createdBook);
})
);
bookRouter.put('/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await BookModel.findOne(bookId);
  if (book) {
    book.title = req.body.title;
    book.slug = req.body.slug;
    book.page = req.body.page;
    book.image = req.body.image;
    book.category = req.body.category;
    book.brand = req.body.brand;
    book.description = req.body.description;
    const updatedBook = await book.save();
    res.send({ message: 'Book Updated', book: updatedBook });
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
})
);

bookRouter.delete('/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const book = await BookModel.findOne(req.params.id);
  if (book) {
    const deleteBook = await book.remove();
    res.send({ message: 'Book Deleted', book: deleteBook });
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
})
);

bookRouter.post('/:id/reviews', isAuth, asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await BookModel.findOne(bookId);
  if (book) {
    if (book.reviews.find((x) => x.title === req.user.title)) {
      // return res.status(400)
      res.status(400).send({ message: 'You already submitted a review' });
      return;
    }
    const review = {
      title: req.user.title,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating = book.reviews.reduce((a, c) => c.rating + a, 0) / book.reviews.length;
    console.log(book.reviews);
    const updatedBook = await book.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedBook.reviews[updatedBook.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
})
);

module.exports = bookRouter
