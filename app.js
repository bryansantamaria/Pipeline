const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require("body-parser");
const request = require('request-promise');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const port = 5000;
const createError = require('http-errors');
const passport = require('passport');

//passport config
require('./config/passport')(passport);

///////////////////////////////////////////////////
/// Routers
///////////////////////////////////////////////////

const registerRouter = require('./app_routes/register');
const userRouter = require('./app_routes/user');
const searchRouter = require('./app_routes/search');
const chatRouter = require('./app_routes/chat');
const loginRouter = require('./app_routes/login');
const loginfailedRouter = require('./app_routes/loginfailed');
const chatroomRouter = require('./app_routes/chatroom');
const uploadFile = require('./app_routes/uploadfile');

///////////////////////////////////////////////////
/// MIDDLEWARES
///////////////////////////////////////////////////

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(session({
  secret: '2manyfiles',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

///////////////////////////////////////////////////
/// ROUTES
///////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.render('index.ejs', { loginfailed: false });
});

app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);
app.use('/chat', chatRouter);
app.use('/login', loginRouter);
app.use('/loginfailed', loginfailedRouter);
app.use('/chatroom', chatroomRouter);
app.use('/uploadfile', uploadFile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

///////////////////////////////////////////////////
/// SOCKET.IO
///////////////////////////////////////////////////


let usersOnline = [];
let noOfUsers;
//Socket on tar emot data från klienten, Socket emit skickar data till klienten.
io.on('connection', (socket) => {
  let id = socket.id;

  socket.on('new-user-online', (users) => {
    usersOnline.push(users);
    io.emit('new-user-online', usersOnline);
  });

  socket.on('disconnect', () => {
    noOfUsers = usersOnline.length;

    usersOnline.forEach(user => {
      io.emit('checkOnline', user);
    });

    usersOnline = [];
  });

  //io.emit('disconnect', {user: usersOnline, status: socket.disconnected});

  socket.on('checkOnline', (user) => {
    usersOnline.push(user);

    //console.log('User verified online >');
    //console.log(user);

    if(usersOnline.length == noOfUsers -1) {
      io.emit('new-user-online', usersOnline);
      //console.log('Users online after disconnect >')
      //console.log(usersOnline);
    }
  });

  // is Typing
  socket.on('typing', (user) => {
    socket.broadcast.emit('typing', user);
  });

  socket.on('chat message', function (message) {  //Lyssnar på eventet 'chat message'
    //console.log('\n\nChat message from client >');
    //console.log(message.chatMessage);
    //console.log('\n\n In room: ' + message.roomId);
    request('http://127.0.0.1:3000/chatroom', {       //POST request to server.js containing message
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message.chatMessage)                              //Message body
    }).then(message_from_db => {                              //recieves message + id from server
      //console.log('\n\nChat message recieved from db >');
      //console.log(JSON.parse(message_from_db));
      io.sockets.in(message.roomId).emit('chat message', JSON.parse(message_from_db));   //Emits chat message to all clients
    }).catch(error => {
      console.error('it broke :(');
    });
  });

  socket.on('joinedRoom', id => {
    socket.leave(socket.room);
    //console.log('Joined room: ' + id);
    socket.join(id);
  })

  socket.on('createdChatroom', chatroom => {
    io.emit('createdChatroom', chatroom);
  })

  socket.on('createdPublicChatroom', chatroom => {
    io.emit('createdPublicChatroom', chatroom);
  })

  socket.on('edit', function (chatMessage) {          //Lyssnar på eventet 'chat message'
    request('http://127.0.0.1:3000/chatroom/edit', {       //PUT request to server.js containing message
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatMessage),                              //Message body
    }).then(message => {                              //recieves message + id from server
      //console.log('\n\nChat message edited >');
      //console.log(message);
      io.emit('edit', JSON.parse(message));           //Emits chat message to all clients
    });
  });

  socket.on('delete', function (chatMessage) {          //Lyssnar på eventet 'chat message'
    request('http://127.0.0.1:3000/chatroom', {       //PUT request to server.js containing message
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatMessage),                       //Message body
    }).then(message => {                              //recieves message + id from server
      //console.log('\n\nChat message deleted:' + message);
      //The server recieves a JSON string object and sends it further to all clients connected to the socket.
      io.emit('delete', JSON.parse(message));           //Emits chat message to all clients
    });
  });

  socket.on('mention', mention => {
    io.emit('mention', mention)
  })

  // socket.on('disconnect', (user) => {
  //   socket.broadcast.emit('newUser', socket.username + ' Disconnected')
  // });
});


http.listen(port, function () {
  console.log('listening on *:' + port);
});
