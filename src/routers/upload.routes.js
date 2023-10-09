"use strict";

const multer = require('multer');
const cloudinary = require('cloudinary');
const streamifier = require('streamifier');
const express = require('express');
const asyncHandler = require('express-async-handler');
const { isAdmin, isAuth } = require('../utils');

const uploadRouter = express.Router();

const upload = multer();
uploadRouter.post( '/', isAuth, isAdmin,
  upload.single('image'), asyncHandler(async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
  )
);

// LOCAL UPLOAD
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     cb(null, `${Date.now()}.jpg`);
//   },
// });

// const upload = multer({ storage });

// uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
//   res.send({ image: `/${req.file.path}` });
// });
module.exports = uploadRouter;
