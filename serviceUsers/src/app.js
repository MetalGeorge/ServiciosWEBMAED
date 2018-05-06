var express = require('express');
var app = express();
var db = require('./config/db');

var UserController = require('./routes/UserController');
app.use('/users', UserController);

var AuthController = require('./routes/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;