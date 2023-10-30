"use strict";

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
}, { timeStamps: true });

const bookSchema = new mongoose.Schema({
  isbn: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  published: { type: String, required: true },
  publisher: { type: String, required: true },
  pages: { type: Number, required: true },
  description: { type: String, required: true },
  website: { type: String, required: true },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  reviews: [ reviewSchema ],
}, { timeStamps: true });

const BookModel = mongoose.model('Book', bookSchema)
module.exports = BookModel;
