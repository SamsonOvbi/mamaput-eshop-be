"use strict";

const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../db/models/user.model');
const { isAdmin, isAuth } = require('../services/auth');
const ProductModel = require('../db/models/product.model');
const bookData = require('../db/data/book.data');
const productData = require('../db/data/product.data');
const userData = require('../db/data/user.data');

const productRoute = express.Router();

productRoute.get('/', asyncHandler(async (req, res) => {
  const name = (req.query.name || '');
  const category = (req.query.category || '');
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  console.log('categoryFilter: '); console.log(categoryFilter);
  console.log('nameFilter: '); console.log(nameFilter);
  const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest'
    ? { price: -1 } : order === 'toprated' ? { rating: -1 } : { _id: -1 };
  const products = await ProductModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    .sort(sortOrder);
  res.send(products);
})
);

productRoute.get('/paged', asyncHandler(async (req, res) => {
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;
  const name = (req.query.name || '');
  const category = (req.query.category || '');
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};
  const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest'
    ? { price: -1 } : order === 'toprated' ? { rating: -1 } : { _id: -1 };
  const count = await ProductModel.count({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  });
  const products = await ProductModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ products, page, pages: Math.ceil(count / pageSize) });
})
);

productRoute.get('/categories', asyncHandler(async (req, res) => {
  const categories = await ProductModel.find().distinct('category');
  res.send(categories);
})
);

// productRoute.get( '/seed', asyncHandler(async (req, res) => {
productRoute.post('/seed', asyncHandler(async (req, res) => {
  await UserModel.remove();
  await ProductModel.remove();
  const createdBooks = await UserModel.insertMany(bookData);
  const createdProducts = await ProductModel.insertMany(productData);
  const createdUsers = await UserModel.insertMany(userData);
  res.send({ createdBooks, createdProducts, createdUsers });
})
);

productRoute.get('/slug/:slug', asyncHandler(async (req, res) => {
  const product = await ProductModel.findOne({
    slug: req.params.slug,
  });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
})
);

productRoute.get('/:id', asyncHandler(async (req, res) => {
  // console.log('req.params.id: ' + req.params.id);
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
})
);

productRoute.post('/', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const product = await ProductModel.create({
    name: 'sample name ' + Date.now(),
    image: '../assets/images/p1.jpg',
    price: 0,
    slug: 'sample-slug-' + Date.now(),
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    rating: 0,
    numReviews: 0,
    description: 'sample description',
  });

  const createdProduct = await product.save();
  res.send(createdProduct);
})
);
productRoute.put('/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    res.send({ message: 'Product Updated', product: updatedProduct });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
})
);

productRoute.delete('/:id', isAuth, isAdmin, asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    const deleteProduct = await product.remove();
    res.send({ message: 'Product Deleted', product: deleteProduct });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
})
);

productRoute.post('/:id/reviews', isAuth, asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await ProductModel.findById(productId);
  if (product) {
    if (product.reviews.find((x) => x.name === req.user.name)) {
      // return res.status(400)
      res.status(400).send({ message: 'You already submitted a review' });
      return;
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    console.log(product.reviews);
    const updatedProduct = await product.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
})
);

module.exports = productRoute