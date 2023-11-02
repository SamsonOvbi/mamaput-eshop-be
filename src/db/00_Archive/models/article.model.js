'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  // id: { type: Number, },
  title: { type: String, },
  key: { type: String, },
  content: { type: String, },
  description: { type: String, },
  date: {type: Date, default: Date.now },
  imageUrl: { type: String, }
});

const ArticleModel = mongoose.model ( 'article', articleSchema ) ;
module.exports = ArticleModel;
