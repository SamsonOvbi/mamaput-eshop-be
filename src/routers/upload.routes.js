"use strict";

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const { isAuth } = require('../services/auth.service');
const uploadContr = require('../controller/upload.controller');

const uploadRoute = express.Router();

const multer = require('multer');

// Configure multer to store files in memory
const { isAdmin } = require('../services/auth.service');
const storage = multer.memoryStorage();

// Configure multer to store files in disk
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     const originalName = file.originalname;
//     cb(null, `${Date.now()}-${originalName}`);
//   },
// });

// const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  limits: { fileSize: 300 * 1024 }, // 300kB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});


uploadRoute.post('/', isAuth, isAdmin, upload.single('image'), uploadContr.uploadSingleImageToCloudinary);

// uploadRoute.post('/', isAuth, upload.single('image'), uploadContr.uploadSingleImageToStorage);

module.exports = uploadRoute;
