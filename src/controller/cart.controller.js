const asyncHandler = require('express-async-handler');
const CartModel = require("../models/cart.model");

const cartContr = {};
cartContr.getAllCarts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;
  const startDate = req.query.startDate || new Date('1970-1-1');
  const endDate = req.query.endDate || new Date();
  console.log(startDate, endDate);

  let cartCount = await CartModel.find().countDocuments();
  const carts = await CartModel.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  }).select('-_id -products._id').limit(limit).sort({ id: sort })
  if (carts) {
    console.log(`${cartCount} Carts in database`);
    res.send(carts);
  } else {
    res.status(404).send({ message: 'No Carts in database' });
  }
});

cartContr.getSingleCart = asyncHandler(async (req, res) => {
  const cart = await CartModel.findOne(req.params.id);
  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

cartContr.getCartsByUserid = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const startDate = req.query.startDate || new Date('1970-1-1');
  const endDate = req.query.endDate || new Date();
  console.log(startDate, endDate);

  const cart = await CartModel.find({
    userId, date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  }).select('-_id -products._id');
  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

cartContr.test = asyncHandler(async (req, res) => {
  res.send({ message: 'Welcome to cart api endpoint' });
});

cartContr.addCart = asyncHandler(async (req, res) => {
  const body = req.body;
  let cartCount = await CartModel.find().countDocuments();
  const addedCart = await CartModel.create({
    id: cartCount + 1,
    userId: body.userId,
    date: body.date,
    products: body.products,
  })
  res.send(addedCart);
});

cartContr.editCart = asyncHandler(async (req, res) => {
  const body = req.body;
  const productId = req.params.id;
  const cart = await CartModel.findById(productId);

  if (cart) {
    cart.id = parseInt(req.params.id);
    cart.user.id = body.userId;
    cart.date = body.date;
    cart.products = body.products;
    const updatedUser = await cart.save();
    res.send({ message: 'Cart Updated', product: updatedUser });
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

cartContr.deleteCart = asyncHandler(async (req, res) => {
  const cart = await CartModel.findById(req.params.id);
  if (cart) {
    const deletedCart = await cart.remove();
    res.send({ message: 'Cart Deleted', cart: deletedCart });
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

module.exports = cartContr;
