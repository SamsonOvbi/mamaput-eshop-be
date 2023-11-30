const asyncHandler = require("express-async-handler");
const ArticleModel = require("../models/article.model");

const articleContr = {};

articleContr.getAllArticles = asyncHandler(async (req, res) => {
  const name = (req.query.name || '');
  const category = (req.query.category || '');
  const limit = Number(req.query.limit) || 0;
  // const sort = req.query.sort === 'desc' ? -1 : 1;
  const order = (req.query.order || '');
  const min = req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 1;
  const max = req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 1900;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 0;

  const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const categoryFilter = category ? { category } : {};
  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest' ? { price: -1 } : order === 'toprated' ? { rating: -1 }
    : order === 'a-z' ? { name: 1 } : order === 'z-a' ? { name: -1 } : { _id: -1 };

  await ArticleModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter
  })
    .select(['-_id']).limit(limit)
    // .sort({ id: sort })
    .sort(sortOrder)
    .then((articles) => {
      res.json(articles);
    })
    .catch((err) => console.log(err));
});


articleContr.getPagedArticles = asyncHandler(async (req, res) => {
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
  const sortOrder = order === 'lowest' ? { price: 1 } : order === 'highest'
    ? { price: -1 } : order === 'toprated' ? { rating: -1 } : { _id: -1 };
  const count = await ArticleModel.count({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  });
  const articles = await ArticleModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ articles, page, pages: Math.ceil(count / pageSize) });
});

articleContr.getArticleCategories = asyncHandler(async (req, res) => {
  const categories = await ArticleModel.find().distinct('category');
  res.send(categories);
});

articleContr.getArticle = asyncHandler(async (req, res) => {
  const article = await ArticleModel.findById(req.params.id);
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ message: 'Article Not Found' });
  }
});

articleContr.getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await ArticleModel.findOne({ slug: req.params.slug, });
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ message: 'Article Not Found' });
  }
});

articleContr.getArticlesInCategory = asyncHandler(async (req, res) => {
  const category = req.params.category || 'jewelry';
  const limit = Number(req.query.limit) || 5;
  const sort = req.query.sort === 'desc' ? -1 : 1;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 1;

  // const categoryFilter = category ? { category } : {};
  const categoryFilter = category ? category : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  console.log("categoryFilter: "); console.log(categoryFilter);
  console.log("ratingFilter: "); console.log(ratingFilter);
  const article = await ArticleModel.find({ ...categoryFilter }).select(['-_id']).limit(limit).sort({ _id: sort })
  // const article = await ArticleModel.find({ ...categoryFilter, ...ratingFilter }).select(['-_id']).limit(limit).sort({ _id: sort, })
  if (article) {
    res.send(article);
  } else {
    res.status(404).send({ message: 'Article Not Found' });
  }
});

articleContr.addArticle = asyncHandler(async (req, res) => {
  const article = await ArticleModel.create({
    id: (req.body.id || 21),
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

  // const createdArticle = await article.save();
  // res.send(createdArticle);
  res.send(article);
});

articleContr.editArticle = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const article = await ArticleModel.findById(articleId);
  if (article) {
    article.name = req.body.name;
    article.slug = req.body.slug;
    article.price = req.body.price;
    article.image = req.body.image;
    article.category = req.body.category;
    article.brand = req.body.brand;
    article.countInStock = req.body.countInStock;
    article.description = req.body.description;
    const updatedArticle = await article.save();
    res.send({ message: 'Article Updated', article: updatedArticle });
  } else {
    res.status(404).send({ message: 'Article Not Found' });
  }
});

articleContr.deleteArticle = asyncHandler(async (req, res) => {
  const article = await ArticleModel.findById(req.params.id);
  if (article) {
    const deleteArticle = await article.remove();
    res.send({ message: 'Article Deleted', article: deleteArticle });
  } else {
    res.status(404).send({ message: 'Article Not Found' });
  }
});

articleContr.writeReview = asyncHandler(async (req, res) => {
  const articleId = req.params.id;
  const article = await ArticleModel.findById(articleId);
  if (article) {
    if (article.reviews.find((x) => x.name === req.user.name)) {
      // return res.status(400)
      res.status(400).send({ message: 'You already submitted a review' });
      return;
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    article.reviews.push(review);
    article.numReviews = article.reviews.length;
    article.rating = article.reviews.reduce((a, c) => c.rating + a, 0) / article.reviews.length;
    console.log(article.reviews);
    const updatedArticle = await article.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedArticle.reviews[updatedArticle.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Article Not Found' });
  }
});

module.exports = articleContr;
