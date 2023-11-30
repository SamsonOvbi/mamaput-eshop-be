const asyncHandler = require("express-async-handler");
const BookModel = require("../models/book.model");

const bookContr = {};

bookContr.getAllBooks = asyncHandler(async (req, res) => {
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

  await BookModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter
  })
    .select(['-_id']).limit(limit)
    // .sort({ id: sort })
    .sort(sortOrder)
    .then((books) => {
      res.json(books);
    })
    .catch((err) => console.log(err));
});


bookContr.getPagedBooks = asyncHandler(async (req, res) => {
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
  const count = await BookModel.count({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  });
  const books = await BookModel.find({
    ...nameFilter, ...categoryFilter, ...priceFilter, ...ratingFilter,
  })
    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.send({ books, page, pages: Math.ceil(count / pageSize) });
});

bookContr.getBookCategories = asyncHandler(async (req, res) => {
  const categories = await BookModel.find().distinct('category');
  res.send(categories);
});

bookContr.getBook = asyncHandler(async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

bookContr.getBookBySlug = asyncHandler(async (req, res) => {
  const book = await BookModel.findOne({ slug: req.params.slug, });
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

bookContr.getBooksInCategory = asyncHandler(async (req, res) => {
  const category = req.params.category || 'jewelry';
  const limit = Number(req.query.limit) || 5;
  const sort = req.query.sort === 'desc' ? -1 : 1;
  const rating = req.query.rating && Number(req.query.rating) !== 0 ? Number(req.query.rating) : 1;

  // const categoryFilter = category ? { category } : {};
  const categoryFilter = category ? category : {};
  const ratingFilter = rating ? { rating: { $gte: rating } } : {};

  console.log("categoryFilter: "); console.log(categoryFilter);
  console.log("ratingFilter: "); console.log(ratingFilter);
  const book = await BookModel.find({ ...categoryFilter }).select(['-_id']).limit(limit).sort({ _id: sort })
  // const book = await BookModel.find({ ...categoryFilter, ...ratingFilter }).select(['-_id']).limit(limit).sort({ _id: sort, })
  if (book) {
    res.send(book);
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

bookContr.addBook = asyncHandler(async (req, res) => {
  const book = await BookModel.create({
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

  // const createdBook = await book.save();
  // res.send(createdBook);
  res.send(book);
});

bookContr.editBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await BookModel.findById(bookId);
  if (book) {
    book.name = req.body.name;
    book.slug = req.body.slug;
    book.price = req.body.price;
    book.image = req.body.image;
    book.category = req.body.category;
    book.brand = req.body.brand;
    book.countInStock = req.body.countInStock;
    book.description = req.body.description;
    const updatedBook = await book.save();
    res.send({ message: 'Book Updated', book: updatedBook });
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

bookContr.deleteBook = asyncHandler(async (req, res) => {
  const book = await BookModel.findById(req.params.id);
  if (book) {
    const deleteBook = await book.remove();
    res.send({ message: 'Book Deleted', book: deleteBook });
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

bookContr.writeReview = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await BookModel.findById(bookId);
  if (book) {
    if (book.reviews.find((x) => x.name === req.user.name)) {
      // return res.status(400)
      res.status(400).send({ message: 'You already submitted a review' });
      return;
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating = book.reviews.reduce((a, c) => c.rating + a, 0) / book.reviews.length;
    console.log(book.reviews);
    const updatedBook = await book.save();
    res.status(201).send({
      message: 'Review Created',
      review: updatedBook.reviews[updatedBook.reviews.length - 1],
    });
  } else {
    res.status(404).send({ message: 'Book Not Found' });
  }
});

module.exports = bookContr;
