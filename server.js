var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var server = express();
//Move to server.js
let mongo = require("mongodb");
let monk = require("monk");
let bodyParser = require("body-parser");
var usersDB = monk('localhost:27017/users');

// TODO: Move to server.js
server.use(bodyParser.urlencoded({
  extended: false
}));
// TODO: Move to server.js
server.use(bodyParser.json());
// TODO: Move to server.js
server.use(function (req, res, next) {
  req.db = usersDB;
  next();
});

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.server.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000);

module.exports = server;
