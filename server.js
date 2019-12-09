const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const server = express();
const mongo = require("mongodb");
const monk = require("monk");
const bodyParser = require("body-parser");
const usersDB = monk('localhost:27017/users');
const port = 3000;

///////////////////////////////////////////////////
/// Routers
///////////////////////////////////////////////////

const registerRouter = require('./server_routes/register');
const userRouter = require('./server_routes/user');
const loginRouter = require('./server_routes/login');
const chatRouter = require('./server_routes/chat');
const chatroomRouter = require('./server_routes/chatroom');

///////////////////////////////////////////////////
/// MIDDLEWARES
///////////////////////////////////////////////////

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
 
///////////////////////////////////////////////////
/// ROUTES
///////////////////////////////////////////////////

server.use('/register', registerRouter);
server.use('/user', userRouter);
server.use('/chat', chatRouter);
server.use('/login', loginRouter);
server.use('/chatroom', chatroomRouter);

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

/* POST Update user. */
server.put('/chatroom', function (req, res) {
  var msgDB = req.db;
  var collection = msgDB.get('messages');

  collection.update({'_id': req.body._id}, {
    $set: {
      'alias': req.body.content.alias,
      'content': req.body.content.message,
      'datetime': req.body.content.date
    }
  }, (err, edit_msg_db) => {
    if(err) throw err;
    res.json(JSON.stringify(edit_msg_db));
  });
});

/* GET delete user. */
server.get('/chatroom', function (req, res) {
  var msgDB = req.db;
  var collection = msgDB.get('messages');

  collection.remove({ '_id': req.body._id }, (err, message_id) => {
    if (err) throw err;
      res.json(JSON.stringify(message_id));
      res.send('200');
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

server.listen(port, function () {
  console.log('listening on *:' + port);
});

