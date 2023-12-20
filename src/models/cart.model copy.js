//Order.JS to create Order Schema in the application

//Including the required packages and assigning it to Local Variables
const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;


//Creating a Order Schema
const CartSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
  totalPrice: { type: Number, default: 0},
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product'},
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });


//Using deep-populate to facilitate rating feature
CartSchema.plugin(deepPopulate);

//Exporting the Order schema to reuse
module.exports = mongoose.model('Cart', CartSchema);

// import { User } from "./user";

// export interface Item {
//   _id: string;
//   image: string;
//   name: string;
//   slug: string;
//   price: number;
//   quantity: number;
// }
// export interface ShippingAddress {
//   fullName: string;
//   address: string;
//   city: string;
//   country: string;
//   postalCode: string;
//   lat: number;
//   lng: number;
// }
// export interface Cart {
//   items: Item[];
//   shippingAddress: ShippingAddress;
//   user: User;
//   paymentMethod: string;
//   itemsCount: number;
//   itemsPrice: number;
//   taxPrice: number;
//   shippingPrice: number;
//   totalPrice: number;
// }
