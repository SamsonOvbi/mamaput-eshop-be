const asyncHandler = require('express-async-handler');
const CartModel = require("../models/cart.model");

const cartContr = {};
cartContr.getAllCarts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == 'desc' ? -1 : 1;
  const startDate = req.query.startDate || new Date('1970-1-2');
  const endDate = req.query.endDate || new Date();
  console.log(startDate, endDate);

  let cartCount = await CartModel.find().countDocuments();
  const carts = await CartModel.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
    // }).select('-_id -items._id').limit(limit).sort({ id: sort })
  }).limit(limit).sort({ id: sort })
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
  }).select('-_id -items._id');
  if (cart) {
    res.send(cart);
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

cartContr.test = asyncHandler(async (req, res) => {
  res.send({ message: 'Welcome to cart api endpoint' });
});

cartContr.createCart = asyncHandler(async (req, res) => {
  let cartCount = await CartModel.find().countDocuments();
  // console.log('cartCount: '); console.log(cartCount);
  const reqBody = {
    id: cartCount + 1,
    items: req.body.items.map((x) => ({ ...x, product: x._id })),
    shippingAddress: req.body.shippingAddress,
    userId: req.user,
    paymentMethod: req.body.paymentMethod,
    itemsCount: req.body.itemsCount,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  }
  // console.log('reqBody: '); console.log(reqBody);
  const addedCart = await CartModel.create(reqBody)
  console.log('addedCart: '); console.log(addedCart);
  res.send(addedCart);
});

cartContr.editCart = asyncHandler(async (req, res) => {
  const body = req.body;
  const itemId = req.params.id;
  const cart = await CartModel.findById(itemId);
  console.log('cart: '); console.log(cart);

  if (cart) {
    cart.id = parseInt(req.params.id);
    cart.user.id = body.userId;
    cart.date = body.date;
    cart.items = body.items;
    const updatedUser = await cart.save();
    console.log('updatedUser: '); console.log(updatedUser);
    // res.send({ message: 'Cart Updated', item: updatedUser });
    res.send(updatedUser);
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

cartContr.deleteCart = asyncHandler(async (req, res) => {
  const cart = await CartModel.findById(req.params.id);
  if (cart) {
    const deletedCart = await cart.remove();
    console.log('deletedCart: '); console.log(deletedCart);
    res.send({ message: 'Cart Deleted', cart: deletedCart });
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

module.exports = cartContr;
