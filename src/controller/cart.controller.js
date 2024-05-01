const asyncHandler = require('express-async-handler');
const CartModel = require("../models/cart.model");

const cartContr = {};
cartContr.getAllCarts = asyncHandler(async (req, res) => {
  let cartCount = await CartModel.find().countDocuments();
  const carts = await CartModel.find();
  if (carts) {
    console.log(`${cartCount} Carts in database`);
    res.send(carts);
  } else {
    res.status(404).send({ message: 'No Carts in database' });
  }
});

cartContr.getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('userId: '); console.log(req.user._id);
  const cart = await CartModel.findOne({ userId });
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
  const body = req.body;
  const reqBody = {
    items: body.items,
    shippingAddress: body.shippingAddress,
    userId: body.userId,
    paymentMethod: body.paymentMethod,
    itemsCount: body.itemsCount,
    itemsPrice: body.itemsPrice,
    taxPrice: body.taxPrice,
    shippingPrice: body.shippingPrice,
    totalPrice: body.totalPrice,
  }
  const createdCart = await CartModel.create(reqBody)
  console.log('createdCart: '); console.log(createdCart);
  res.send(createdCart);
});

cartContr.editCart = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const cart = await CartModel.findOne({ userId });
  if (cart.paymentMethod !== '') {
    // console.log('req.body: '); console.log(req.body);
    cart.items = req.body.items;
    cart.shippingAddress = req.body.shippingAddress;
    cart.userId = req.body.userId;
    cart.paymentMethod = req.body.paymentMethod;
    cart.itemsCount = req.body.itemsCount;
    cart.itemsPrice = req.body.itemsPrice;
    cart.taxPrice = req.body.taxPrice;
    cart.shippingPrice = req.body.shippingPrice;
    cart.totalPrice = req.body.totalPrice;
    await cart.save()
      .then((updatedUser) => {
        console.log('updatedUser: '); console.log(updatedUser);
        res.send(updatedUser)
      })
      .catch(err => res.status(500).send({ message: err.message }));
  } else {
    console.log('initialized cart: '); console.log(cart);
    let reqBody;
    const order = await CartModel.findOne({ userId });
    const body = req.body;
    reqBody = {
      items: body.items,
      shippingAddress: body.shippingAddress,
      userId: body.userId,
      paymentMethod: body.paymentMethod,
      itemsCount: body.itemsCount,
      itemsPrice: body.itemsPrice,
      taxPrice: body.taxPrice,
      shippingPrice: body.shippingPrice,
      totalPrice: body.totalPrice,
    }
    if (order.paymentMethod !== '') {
      reqBody.shippingAddress = order.shippingAddress;
      reqBody.paymentMethod = order.paymentMethod;
    }
    const createdCart2 = await CartModel.create(reqBody)
    console.log('initialCart: '); console.log(createdCart2);
    res.send(createdCart2);
    // res.status(404).send({ message: 'Cart Not Found' });
  }
});

cartContr.deleteCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await CartModel.findOne({ userId });
  if (cart) {
    const deletedCart = await cart.remove();
    console.log('deletedCart: '); console.log(deletedCart);
    res.send(deletedCart);
  } else {
    res.status(404).send({ message: 'Cart Not Found' });
  }
});

module.exports = cartContr;
