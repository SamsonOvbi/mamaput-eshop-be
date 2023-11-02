'use strict';

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema ( {
  name: { type: String, required: true },
  categoryID: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true }
} ) ;

const ProductModel = mongoose.model ( 'product', productSchema ) ;
module.exports = ProductModel;
