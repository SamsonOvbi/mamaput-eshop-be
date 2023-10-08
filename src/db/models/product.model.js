"use strict";

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
}, { timeStamps: true });

const productSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  countInStock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
  // reviews: [{  reviewSchema }],
  reviews: [ reviewSchema ],
}, { timeStamps: true });

const ProductModel = mongoose.model('Product', productSchema)
module.exports = ProductModel;
