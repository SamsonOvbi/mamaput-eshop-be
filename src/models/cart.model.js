'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new mongoose.Schema({
  id: { type: String },
  image: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

var ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  postalCode: { type: String },
  lat: Number,
  lng: Number,
});

var PaymentResultSchema = new mongoose.Schema({
  paymentId: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
});

var cartSchema = new mongoose.Schema({
  items: [ItemSchema],
  shippingAddress: ShippingAddressSchema,
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
  userId: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  itemsCount: { type: Number, required: true, default: 1 },
  // paymentResult: PaymentResultSchema,
  itemsPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;
