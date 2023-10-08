'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  lat: Number,
  lng: Number,
});

var ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  image: { type: Number, required: true },
  price: Number,
  product: { type: Schema.Types.ObjectId, ref: 'Product'},
});

var PaymentResultSchema = new mongoose.Schema({
// class PaymentResult {
  paymentId: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
});

var OrderSchema = new mongoose.Schema({
  _id: { type: String },
  // items: [{ type: Schema.Types.ObjectId, ref: 'Item'}],
  items: [ ItemSchema ],
  // shippingAddress: { type: Schema.Types.ObjectId, ref: 'ShippingAddress'},
    shippingAddress: ShippingAddressSchema,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  paymentMethod: { type: String },
  // paymentResult: { type: Schema.Types.ObjectId, ref: 'PaymentResult'},
  paymentResult: PaymentResultSchema,
  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: Date
}, {timestamps: true});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
