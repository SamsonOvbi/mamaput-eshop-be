"use strict";

const express = require('express');
const { isAuth } = require('../services/auth.service');
const mapContr = require('../controller/map.controller');

const mapRoute = express.Router();

mapRoute.get('/google', isAuth, mapContr.getGoogleApiKey);
// mapRoute.get('/oSMap', isAuth, mapContr.getOSMapApiKey);

mapRoute.get('/test', mapContr.test);

module.exports = mapRoute;
