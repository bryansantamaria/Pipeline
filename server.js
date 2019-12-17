const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const server = express();
const monk = require("monk");
const bodyParser = require("body-parser");
const pipelineDB = monk('localhost:27017/pipeline');
const port = 3000;
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

///////////////////////////////////////////////////
/// Routers
///////////////////////////////////////////////////

const registerRouter = require('./server_routes/register');
const userRouter = require('./server_routes/user');
const searchRouter = require('./server_routes/search');
const loginRouter = require('./server_routes/login');
const chatRouter = require('./server_routes/chat');
const chatroomRouter = require('./server_routes/chatroom');
const uploadFile = require('./server_routes/uploadfile');

///////////////////////////////////////////////////
/// MIDDLEWARES
///////////////////////////////////////////////////

server.use(bodyParser.urlencoded({
  extended: false
}));
server.use(bodyParser.json());

server.use(function (req, res, next) {
  req.db = pipelineDB;
  next();
});

//passport middleware
server.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// //Global Vars for login
// server.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });

//Passport middleware
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

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
server.use('/search', searchRouter);
server.use('/chat', chatRouter);
server.use('/login', loginRouter);
server.use('/chatroom', chatroomRouter);
server.use('/uploadfile', uploadFile);

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
