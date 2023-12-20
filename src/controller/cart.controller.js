const asyncHandler = require('express-async-handler');
const CartModel = require("../models/cart.model");

const cartContr = {};
cartContr.getAllCarts = asyncHandler(async (req, res) => {
  const cartCount = await CartModel.find().countDocuments();
  const carts = await CartModel.find();
  if (carts) {
    console.log(`${cartCount} Carts in database`);
    res.send(carts);
  } else {
    const reqBody = {
      id: cartCount + 1,
      items: [],
      shippingAddress: {
        fullName: '', address: '', city: '', country: '',
        postalCode: '', lat: 0, lng: 0,
      },
      userId: '', paymentMethod: '', itemsCount: 0,
      itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0,
    }
    const defaultCart = await CartModel.create(reqBody)
    res.send(defaultCart);
    // res.status(404).send({ message: 'No Carts in database' });
  }
});

cartContr.getCartsByUserid = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const cart = await CartModel.find({ userId });
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
    userId: req.user._id,
    paymentMethod: req.body.paymentMethod,
    itemsCount: req.body.itemsCount,
    itemsPrice: req.body.itemsPrice,
    taxPrice: req.body.taxPrice,
    shippingPrice: req.body.shippingPrice,
    totalPrice: req.body.totalPrice,
  }
  console.log('reqBody: '); console.log(reqBody);
  const addedCart = await CartModel.create(reqBody)
  console.log('addedCart: '); console.log(addedCart);
  res.send(addedCart);
});

cartContr.editCart = asyncHandler(async (req, res) => {
  const body = req.body;
  console.log('body: '); console.log(body);
  const itemId = req.user._id;
  // console.log('itemId: '); console.log(itemId);
  const cart = await CartModel.findOne({ itemId });

  if (cart) {
    console.log('cart: '); console.log(cart);
    // cart.items = req.body.items.map((x) => ({ ...x, }));
    // console.log('req.body.items: '); console.log(req.body.items);
    // cart.shippingAddress = req.body.shippingAddress;
    // console.log('cart: '); console.log(cart);
    // cart.user.id = req.user._id;
    // cart.paymentMethod = req.body.paymentMethod;
    // cart.itemsCount = req.body.itemsCount;
    // cart.itemsPrice = req.body.itemsPrice;
    // cart.taxPrice = req.body.taxPrice;
    // cart.shippingPrice = req.body.shippingPrice;
    // cart.totalPrice = req.body.totalPrice;
    console.log('cart: '); console.log(cart);

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
