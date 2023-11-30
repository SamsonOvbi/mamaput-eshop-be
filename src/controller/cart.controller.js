const cartModel = require("../db/model/cart.model");

const cartContr = {};
cartContr.getAllCarts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);

	cartModel.find({
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	}).select('-_id -products._id').limit(limit).sort({ id: sort })
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

cartContr.getCartsByUserid = (req, res) => {
	const userId = req.params.userid;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);
	cartModel.find({
		userId,
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	}).select('-_id -products._id')
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

cartContr.getSingleCart = (req, res) => {
	const id = req.params.id;
	cartModel.findOne({id,}).select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => console.log(err));
};

cartContr.addCart = (req, res) => {
	if (typeof req.body == undefined) {
		res.json({
			status: 'error',
			message: 'data is undefined',
		});
	} else {
		//     let cartCount = 0;
		// cartModel.find().countDocuments(function (err, count) {
		//   cartCount = count
		//   })

		//     .then(() => {
		const cart = {
			id: 11,
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		};
		// cart.save()
		//   .then(cart => res.json(cart))
		//   .catch(err => console.log(err))

		res.json(cart);
		// })

		//res.json({...req.body,id:cartModel.find().count()+1})
	}
};

cartContr.editCart = (req, res) => {
	if (typeof req.body == undefined || req.params.id == null) {
		res.json({
			status: 'error',
			message: 'something went wrong! check your sent data',
		});
	} else {
		res.json({
			id: parseInt(req.params.id),
			userId: req.body.userId,
			date: req.body.date,
			products: req.body.products,
		});
	}
};

cartContr.deleteCart = (req, res) => {
	if (req.params.id == null) {
		res.json({
			status: 'error',
			message: 'cart id should be provided',
		});
	} else {
		cartModel.findOne({ id: req.params.id }).select('-_id -products._id')
			.then((cart) => {
				res.json(cart);
			})
			.catch((err) => console.log(err));
	}
};

module.exports = cartContr;
