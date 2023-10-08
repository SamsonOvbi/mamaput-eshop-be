"use strict";

const mongoose = require("mongoose");

var ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
});

var ProductSchema = new mongoose.Schema({
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
  reviews: { type: ReviewSchema}
});

// export const ProductModel = getModelForClass(Product);
module.exports = { ReviewSchema, ProductSchema };
