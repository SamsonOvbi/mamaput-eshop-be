const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/product.model");

const productContr = {};

productContr.getAllProducts = asyncHandler(async (req, res) => {
  const name = (req.query.name || '');
  // const description = (req.query.description || '');
  const category = (req.query.category || '');
  const limit = Number(req.query.limit) || 0;
  // const sort = req.query.sort === 'desc' ? -1 : 1;
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 1;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 1900;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  // const descriptionFilter = name ? { name: { $regex: description, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest' ? { price: -1 } : order === 'toprated'
    ? { rating: -1 }: order === 'a-z' ? { name: 1 } : order === 'z-a' ? { name: -1 } : { _id: -1 };

  await ProductModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    // .select(['-_id']).limit(limit)
    .limit(limit)
    // .sort({ id: sort })
    .sort(sortOrder)
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
});


productContr.getPagedProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 3;
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
  const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest'? { price: -1 } : order === 'toprated'
    ? { rating: -1 } : { _id: -1 };
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
});

productContr.getProductCategories = asyncHandler(async (req, res) => {
  const categories = await ProductModel.find().distinct('category');
  res.send(categories);
});

productContr.getProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await ProductModel.findOne({ slug: req.params.slug, });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.getProductsInCategory = asyncHandler(async (req, res) => {
  const category = req.params.category || 'jewelry';
  const limit = Number(req.query.limit) || 5;
  const sort = req.query.sort === 'desc' ? -1 : 1;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 1;

  // const categoryFilter = category ? { category } : {};
  const categoryFilter = category ? category : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  console.log("categoryFilter: "); console.log(categoryFilter);
  console.log("ratingFilter: "); console.log(ratingFilter);
  const product = await ProductModel.find({ ...categoryFilter }).select(['-_id']).limit(limit).sort({ _id: sort })
  // const product = await ProductModel.find({ ...categoryFilter, ...ratingFilter }).select(['-_id']).limit(limit).sort({ _id: sort, })
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.addProduct = asyncHandler(async (req, res) => {
  let productCount = await ProductModel.find().countDocuments();
  const product = await ProductModel.create({
    // id: (req.body.id || 21),
    id: (req.body.id || productCount),
    name: (req.body.name || 'sample name ') + Date.now(),
    image: req.body.image || '../assets/images/p1.jpg',
    price: req.body.price || 0,
    slug: (req.body.slug || 'sample-slug') + '-' + Date.now(),
    category: req.body.category || 'sample category',
    brand: (req.body.brand || 'sample brand'),
    countInStock: req.body.countInStock || 0,
    rating: req.body.rating || 0,
    numReviews: req.body.numReviews || 0,
    description: (req.body.price || 'sample description'),
  });

  // const createdProduct = await product.save();
  // res.send(createdProduct);
  res.send(product);
});

productContr.editProduct = asyncHandler(async (req, res) => {
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
});

productContr.deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  if (product) {
    const deleteProduct = await product.remove();
    res.send({ message: 'Product Deleted', product: deleteProduct });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

productContr.writeReview = asyncHandler(async (req, res) => {
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
});

productContr.test = asyncHandler(async (req, res) => {
  res.send({ message: 'Welcome to product api endpoint' });
});

module.exports = productContr;
