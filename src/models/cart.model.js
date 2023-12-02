'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  lat: Number,
  lng: Number,
});

var ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
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
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String, required: true },
  paymentResult: PaymentResultSchema,
  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: Date
}, { timestamps: true });

const CartModel = mongoose.model('Order', cartSchema);
module.exports = CartModel;
