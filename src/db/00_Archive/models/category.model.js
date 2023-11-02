'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema ( {
  name: { type: String, required: true },
} ) ;

const CategoryModel = mongoose.model ( 'category', categorySchema ) ;
module.exports = CategoryModel;
 