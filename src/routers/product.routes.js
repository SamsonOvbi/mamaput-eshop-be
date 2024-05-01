"use strict";

const express = require('express');
const { isAdmin, isAuth } = require('../services/auth.service');
const productContr = require('../controller/product.controller');

const productRoute = express.Router();

productRoute.get('/', productContr.getAllProducts);
productRoute.get('/paged', productContr.getPagedProducts);
productRoute.get('/categories', productContr.getProductCategories);
productRoute.get('/test', productContr.test);
productRoute.get('/:id', productContr.getProduct);
productRoute.get('/slug/:slug', productContr.getProductBySlug);
productRoute.get('/category/:category', productContr.getProductsInCategory);

productRoute.post('/', isAuth, isAdmin, productContr.addProduct);
productRoute.put('/:id', isAuth, isAdmin, productContr.editProduct);
productRoute.delete('/:id', isAuth, isAdmin, productContr.deleteProduct);
productRoute.post('/:id/reviews', isAuth, productContr.writeReview);

module.exports = productRoute
