var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var server = express();
// Moved to server.js
let mongo = require("mongodb");
let monk = require("monk");
let bodyParser = require("body-parser");
var usersDB = monk('localhost:27017/users');

// Moved to server.js
server.use(bodyParser.urlencoded({
  extended: false
}));
// Moved to server.js
server.use(bodyParser.json());
// Moved to server.js
server.use(function (req, res, next) {
  req.db = usersDB;
  next();
});



server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

// Moved to server.js
server.post('/register', (req, res) => {
  var userDB = req.db;
  var collection = userDB.get("users");
  collection.insert({
    "email": req.body.email,
    "password": req.body.password,
    "alias": req.body.username
  });

  res.send('200');
});

// Moved to server.js
server.get('/chat', (req, res) => {
  var userDB = req.db;
  var collection = userDB.get("users");
  collection.find({}, {}, function (e, users) {
    res.json(users);
  });
});
// Moved to server.js
server.post('/login', async (req, res) => {
  var userDB = req.db;
  var collection = userDB.get("users");
  collection.find({ "alias": req.body.username }, {}).then(user => {
    console.log(user);
    if (user[0]) {
      if (user[0].password == req.body.password) {
        res.send(true);
      } else {
        res.send(false);
      }
    } else {
      res.send(false);
    }
  });
});

var msgDB = monk('localhost:27017/messages');
server.use(function (req, res, next) {
  req.db = msgDB;
  next();
});

//Moved to server.js
server.post('/chatroom', (req, res) => {
  var msgDB = req.db;
  var collection = msgDB.get('messages');
  console.log(req.body);
  collection.insert({ //Inserts message to DB
    'alias': req.body.content.alias,
    'content': req.body.content.message,
    'datetime': req.body.content.date,
    'attachments': [
      {
        'url': 'localhost:27017/attachments',
        'filename': 'test.jpg'
      }
    ]
  }, (err, message_in_db) => { //Gets message back from database
    if (err) throw err;
    console.log(message_in_db);
    res.json(JSON.stringify(message_in_db)); //Returns message to app.js
  });

});

// catch 404 and forward to error handler
server.use(function (req, res, next) {
  next(createError(404));
});

// error handler
server.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.server.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(3000);

module.exports = server;
