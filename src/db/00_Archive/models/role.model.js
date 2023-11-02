'use strict';

const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	rating: { type: Number, required: true },
	bootcamp: { type: String, required: true },
	user: { type: String, required: true },
});

const RoleModel = mongoose.model('role', roleSchema);
module.exports = RoleModel;
