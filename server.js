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
const fs = require('fs');

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


function parseEmoji() {
  fs.readFile('emoji/emoji.json', (err, emojis) => {
    //emojis = JSON.parse(emojis.emojis);
    if(err) throw err;
    let parsedEmojis = JSON.parse(emojis).emojis;
    let emojiCollection = pipelineDB.get('emojis');

    let emojiObjects = [];
    parsedEmojis.forEach(emoji => {
      let emojiObj = {
        name: Object.getOwnPropertyNames(emoji)[0],
        char: emoji[Object.getOwnPropertyNames(emoji)].char,
        category: emoji[Object.getOwnPropertyNames(emoji)].category
      };

      emojiObjects.push(emojiObj);
    });

    let categoryNames = [];

    emojiObjects.forEach(emoji => {
      emojiCollection.insert(emoji);
      /*if(!categoryNames.some(category => category == emoji.category)) {
        categoryNames.push(emoji.category);
      }*/
    })
  })
}

//DONT UNCOMMENT UNLESS YOU WANT 1000000000 EMOJIS IN YOUR COLLECTION
//parseEmoji();

// catch 404 and forward to error handler
server.use(function (req, res, next) {
  next(createError(404));
});

// error handler
server.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.server.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

server.listen(port, function () {
  console.log('listening on *:' + port);
});
