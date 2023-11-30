"use strict";

const express = require('express');
const { isAdmin, isAuth } = require('../services/auth');
const articleContr = require('../controller/article.controller');

const articleRoute = express.Router();

articleRoute.get('/', articleContr.getAllArticles);

articleRoute.get('/paged', articleContr.getPagedArticles);

articleRoute.get('/categories', articleContr.getArticleCategories);
articleRoute.get('/:id', articleContr.getArticle);
articleRoute.get('/slug/:slug', articleContr.getArticleBySlug);
articleRoute.get('/category/:category', articleContr.getArticlesInCategory);

articleRoute.post('/', isAuth, isAdmin, articleContr.addArticle);

articleRoute.put('/:id', isAuth, isAdmin, articleContr.editArticle);

articleRoute.delete('/:id', isAuth, isAdmin, articleContr.deleteArticle);

articleRoute.post('/:id/reviews', isAuth, articleContr.writeReview);

module.exports = articleRoute
